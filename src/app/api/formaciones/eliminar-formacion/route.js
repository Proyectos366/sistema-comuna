/**
 @fileoverview Controlador de API para eliminar (o marcar como eliminado) una formacion del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de eliminación en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado de la formacion. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/formaciones/eliminarFormacion
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEliminarFormacion from "@/services/formaciones/validarEliminarFormacion"; // Servicio para validar la eliminación de la formacion
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para eliminar (lógicamente) una formacion.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado de la formacion.
 
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de eliminación y el ID de la formacion.
 @returns {Promise<Response>} Respuesta HTTP con la formacion actualizada o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_formacion } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarEliminarFormacion(estado, id_formacion);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar la formacion",
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

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta el formacion actualizada
    const [eliminandoFormacion, formacionActualizada] =
      await prisma.$transaction([
        prisma.formacion.update({
          where: { id: validaciones.id_formacion },
          data: {
            borrado: validaciones.borrado,
          },
        }),

        prisma.formacion.findFirst({
          where: {
            id: validaciones.id_formacion,
          },
        }),
      ]);

    // 5. Si no se obtiene la formacion o la actualización falla, registra el error y retorna
    if (!eliminandoFormacion || !formacionActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_DELETE_FORMACION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar la formacion",
        datosAntes: null,
        datosDespues: {
          eliminandoFormacion,
          formacionActualizada,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al eliminar formacion...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno de la formacion actualizada
    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "DELETE_FORMACION",
      id_objeto: formacionActualizada.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Formacion eliminada con exito...",
      datosAntes: null,
      datosDespues: {
        eliminandoFormacion,
        formacionActualizada,
      },
    });

    // 7. Retorna una respuesta exitosa con el formacion actualizada
    return generarRespuesta(
      "ok",
      "Formacion eliminada correctamente...",
      {
        formaciones: formacionActualizada,
      },
      200
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (eliminar formacion): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_formacion: 0,
      descripcion: "Error inesperado al eliminar formacion",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (eliminar formacion)",
      {},
      500
    );
  }
}
