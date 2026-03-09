/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurado) un estante del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del estante. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/estantes/restaurarEstante
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarEstante from "@/services/estantes/validarRestaurarEstante"; // Servicio para validar la restauración del estante
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) un estante.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del estante.
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de restauración y el ID del estante.
 @returns {Promise<Response>} Respuesta HTTP con el estante actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_estante } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarEstante(estado, id_estante);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "estante",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al restaurar estante",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 4. Ejecuta transacción: actualiza el estado de restauracion y consulta el estante actualizado
    const [restaurandoEstante, estanteActualizado] = await prisma.$transaction([
      prisma.estante.update({
        where: { id: validaciones.id_estante },
        data: {
          borrado: validaciones.borrado,
        },
      }),

      prisma.estante.findFirst({
        where: {
          id: validaciones.id_estante,
        },
      }),
    ]);

    // 5. Si no se obtiene el estante o la actualización falla, registra el error y retorna
    if (!restaurandoEstante || !estanteActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "estante",
        accion: "ERROR_DELETE_ESTANTE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo restaurar el estante",
        datosAntes: null,
        datosDespues: {
          restaurandoEstante,
          estanteActualizado,
        },
      });

      return generarRespuesta("error", "Error, al restaurar estante", {}, 400);
    }

    // 6. Registro exitoso del evento y retorno del estante actualizado
    await registrarEventoSeguro(request, {
      tabla: "estante",
      accion: "RESTAURAR_ESTANTE",
      id_objeto: estanteActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Estante restaurado con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoEstante,
        estanteActualizado,
      },
    });

    // 7. Retorna una respuesta exitosa con el estante actualizado
    return generarRespuesta(
      "ok",
      "Estante restaurado correctamente",
      {
        estantes: estanteActualizado,
      },
      200,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (restaurar estante): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "estante",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_estante: 0,
      descripcion: "Error inesperado al restaurar estante",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar estante)",
      {},
      500,
    );
  }
}
