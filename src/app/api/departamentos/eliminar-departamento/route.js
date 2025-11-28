/**
 @fileoverview Controlador de API para eliminar (o marcar como eliminado) un departamento del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de eliminación en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del departamento. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/departamentos/eliminarDepartamento
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEliminarDepartamento from "@/services/departamentos/validarEliminarDepartamento"; // Servicio para validar la eliminación del departamento
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para eliminar (lógicamente) un departamento.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del departamento.
 
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de eliminación y el ID del departamento.
 @returns {Promise<Response>} Respuesta HTTP con el departamento actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_departamento } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarEliminarDepartamento(
      estado,
      id_departamento
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar el departamento",
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

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta el departamento actualizado
    const [eliminandoDepartamento, departamentoActualizado] =
      await prisma.$transaction([
        prisma.departamento.update({
          where: { id: validaciones.id_departamento },
          data: {
            borrado: validaciones.borrado,
          },
        }),

        prisma.departamento.findFirst({
          where: {
            id: validaciones.id_departamento,
          },
        }),
      ]);

    // 5. Si no se obtiene el departamento o la actualización falla, registra el error y retorna
    if (!eliminandoDepartamento || !departamentoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "ERROR_DELETE_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar el departamento",
        datosAntes: null,
        datosDespues: {
          eliminandoDepartamento,
          departamentoActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al eliminar departamento...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno del departamento actualizado
    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "DELETE_DEPARTAMENTO",
      id_objeto: departamentoActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Departamento eliminada con exito...",
      datosAntes: null,
      datosDespues: {
        eliminandoDepartamento,
        departamentoActualizado,
      },
    });

    // 7. Retorna una respuesta exitosa con el departamento actualizado
    return generarRespuesta(
      "ok",
      "Departamento eliminado correctamente...",
      {
        departamentos: departamentoActualizado,
      },
      200
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (eliminar departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_departamento: 0,
      descripcion: "Error inesperado al eliminar departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (eliminar departamento)",
      {},
      500
    );
  }
}
