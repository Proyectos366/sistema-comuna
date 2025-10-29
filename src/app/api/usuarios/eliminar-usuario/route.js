/**
 @fileoverview Controlador de API para eliminar (o marcar como eliminado) a un usuario del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de eliminación en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del usuario. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/usuarios/eliminarUsuario
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEliminarUsuario from "@/services/usuarios/validarEliminarUsuario"; // Servicio para validar la eliminación de usuario
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP PATCH para eliminar (lógicamente) a un usuario.
 * Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 * y retorna una respuesta estructurada con el perfil actualizado del usuario.
 *
 * @async
 * @function PATCH
 * @param {Request} request - Solicitud HTTP con el estado de eliminación y el ID del usuario.
 * @returns {Promise<Response>} Respuesta HTTP con el usuario actualizado o un mensaje de error.
 */

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_usuario } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarEliminarUsuario(estado, id_usuario);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar usuario",
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

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta el usuario actualizado
    const [eliminandoUsuario, usuarioActualizado] = await prisma.$transaction([
      prisma.usuario.update({
        where: { id: validaciones.id_usuario_estado },
        data: {
          borrado: validaciones.borrado,
        },
      }),

      prisma.usuario.findFirst({
        where: {
          id: validaciones.id_usuario_estado,
        },
        select: {
          id: true,
          cedula: true,
          correo: true,
          nombre: true,
          apellido: true,
          borrado: true,
          validado: true,
          createdAt: true,
          id_rol: true,
          roles: {
            select: { id: true, nombre: true },
          },
          MiembrosDepartamentos: {
            select: { id: true, nombre: true, descripcion: true },
          },
        },
      }),
    ]);

    // 5. Si no se obtiene el usuario o la actualización falla, registra el error y retorna
    if (!eliminandoUsuario || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_DELETE_USUARIO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar el usuario",
        datosAntes: null,
        datosDespues: {
          eliminandoUsuario,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al eliminar usuario...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno del usuario actualizado
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "DELETE_USUARIO",
      id_objeto: usuarioActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Usuario eliminado con exito",
      datosAntes: null,
      datosDespues: {
        eliminandoUsuario,
        usuarioActualizado,
      },
    });

    return generarRespuesta(
      "ok",
      "Usuario eliminado correctamente...",
      {
        usuarios: usuarioActualizado,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (eliminar usuario): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al eliminar usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (eliminar usuario)",
      {},
      500
    );
  }
}
