/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurada) una institucion del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado de la institucion. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/instituciones/restaurarInstitucion
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarInstitucion from "@/services/instituciones/validarRestaurarInstitucion"; // Servicio para validar la restauración de la institucion
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) una institucion.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado de la institucion.
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de restauración y el ID de la institucion.
 @returns {Promise<Response>} Respuesta HTTP con la institucion actualizada o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_institucion } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarInstitucion(
      estado,
      id_institucion
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar institucion",
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

    // 4. Ejecuta transacción: actualiza el estado de restauracion y consulta la institucion actualizada
    const [restaurandoInstitucion, institucionActualizada] =
      await prisma.$transaction([
        prisma.institucion.update({
          where: { id: validaciones.id_institucion },
          data: {
            borrado: validaciones.borrado,
          },
        }),

        prisma.institucion.findFirst({
          where: {
            id: validaciones.id_institucion,
          },
        }),
      ]);

    // 5. Si no se obtiene la institucion o la actualización falla, registra el error y retorna
    if (!restaurandoInstitucion || !institucionActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "ERROR_DELETE_INSTITUCION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar la institucion",
        datosAntes: null,
        datosDespues: {
          restaurandoInstitucion,
          institucionActualizada,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al eliminar institucion...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno de la institucion actualizada
    await registrarEventoSeguro(request, {
      tabla: "institucion",
      accion: "RESTAURAR_INSTITUCION",
      id_objeto: institucionActualizada.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Institucion restaurada con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoInstitucion,
        institucionActualizada,
      },
    });

    return generarRespuesta(
      "ok",
      "Institucion restaurada correctamente...",
      {
        instituciones: institucionActualizada,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (restaurar institucion): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "institucion",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_institucion: 0,
      descripcion: "Error inesperado al restaurar institucion",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar institucion)",
      {},
      500
    );
  }
}
