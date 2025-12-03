/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurada) una comuna del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado de la comuna. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/comunas/restaurarComuna
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarComuna from "@/services/comunas/validarRestaurarComuna"; // Servicio para validar la restauración de la comuna
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) una comuna.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado de la comuna.
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de restauración y el ID de la comuna.
 @returns {Promise<Response>} Respuesta HTTP con la comuna actualizada o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_comuna } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarComuna(estado, id_comuna);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al restaurar comuna",
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

    // 4. Ejecuta transacción: actualiza el estado de restauracion y consulta la comuna actualizada
    const [restaurandoComuna, comunaActualizada] = await prisma.$transaction([
      prisma.comuna.update({
        where: { id: validaciones.id_comuna },
        data: {
          borrado: validaciones.borrado,
        },
      }),

      prisma.comuna.findFirst({
        where: {
          id: validaciones.id_comuna,
        },
      }),
    ]);

    // 5. Si no se obtiene la comuna o la actualización falla, registra el error y retorna
    if (!restaurandoComuna || !comunaActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "ERROR_DELETE_COMUNA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo restaurar la comuna",
        datosAntes: null,
        datosDespues: {
          restaurandoComuna,
          comunaActualizada,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al restaurar comuna...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno de la comuna actualizada
    await registrarEventoSeguro(request, {
      tabla: "comuna",
      accion: "RESTAURAR_COMUNA",
      id_objeto: comunaActualizada.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Comuna restaurada con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoComuna,
        comunaActualizada,
      },
    });

    return generarRespuesta(
      "ok",
      "Comuna restaurada correctamente...",
      {
        comunas: comunaActualizada,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (restaurar comuna): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "comuna",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_comuna: 0,
      descripcion: "Error inesperado al restaurar comuna",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar comuna)",
      {},
      500
    );
  }
}
