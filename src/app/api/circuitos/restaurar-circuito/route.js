/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurado) un circuito del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del circuito. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/circuitos/restaurarCircuito
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarCircuito from "@/services/circuitos/validarRestaurarCircuito"; // Servicio para validar la restauración del circuito
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) un circuito.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del circuito.
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de restauración y el ID del circuito.
 @returns {Promise<Response>} Respuesta HTTP con el circuito actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_circuito } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarCircuito(estado, id_circuito);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "circuito",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al restaurar circuito",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 4. Ejecuta transacción: actualiza el estado de restauracion y consulta el circuito actualizado
    const [restaurandoCircuito, circuitoActualizado] =
      await prisma.$transaction([
        prisma.circuito.update({
          where: { id: validaciones.id_circuito },
          data: {
            borrado: validaciones.borrado,
          },
        }),

        prisma.circuito.findFirst({
          where: {
            id: validaciones.id_circuito,
          },
        }),
      ]);

    // 5. Si no se obtiene el circuito o la actualización falla, registra el error y retorna
    if (!restaurandoCircuito || !circuitoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "circuito",
        accion: "ERROR_DELETE_CIRCUITO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo restaurar el circuito",
        datosAntes: null,
        datosDespues: {
          restaurandoCircuito,
          circuitoActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al restaurar circuito...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno del circuito actualizado
    await registrarEventoSeguro(request, {
      tabla: "circuito",
      accion: "RESTAURAR_CIRCUITO",
      id_objeto: circuitoActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Circuito restaurado con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoCircuito,
        circuitoActualizado,
      },
    });

    return generarRespuesta(
      "ok",
      "Circuito restaurado correctamente...",
      {
        circuitos: circuitoActualizado,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (restaurar circuito): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "circuito",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_circuito: 0,
      descripcion: "Error inesperado al restaurar circuito",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar circuito)",
      {},
      500
    );
  }
}
