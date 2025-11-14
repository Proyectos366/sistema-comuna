/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurada) una parroquia del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado de la parroquia. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/parroquias/restaurarParroquia
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarParroquia from "@/services/parroquias/validarRestaurarParroquia"; // Servicio para validar la restauración de la parroquia
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) una parroquia.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado de la parroquia.
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de restauración y el ID de la parroquia.
 @returns {Promise<Response>} Respuesta HTTP con la parroquia actualizada o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_parroquia } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarParroquia(estado, id_parroquia);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar parroquia",
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

    // 4. Ejecuta transacción: actualiza el estado de restauracion y consulta la parroquia actualizada
    const [restaurandoParroquia, parroquiaActualizada] =
      await prisma.$transaction([
        prisma.parroquia.update({
          where: { id: validaciones.id_parroquia },
          data: {
            borrado: validaciones.borrado,
          },
        }),

        prisma.parroquia.findFirst({
          where: {
            id: validaciones.id_parroquia,
          },
        }),
      ]);

    // 5. Si no se obtiene la parroquia o la actualización falla, registra el error y retorna
    if (!restaurandoParroquia || !parroquiaActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "ERROR_DELETE_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar la parroquia",
        datosAntes: null,
        datosDespues: {
          restaurandoParroquia,
          parroquiaActualizada,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al eliminar parroquia...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno de la parroquia actualizada
    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "RESTAURAR_PARROQUIA",
      id_objeto: parroquiaActualizada.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Parroquia restaurada con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoParroquia,
        parroquiaActualizada,
      },
    });

    return generarRespuesta(
      "ok",
      "Parroquia restaurada correctamente...",
      {
        parroquias: parroquiaActualizada,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (restaurar parroquia): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_parroquia: 0,
      descripcion: "Error inesperado al restaurar parroquia",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar parroquia)",
      {},
      500
    );
  }
}
