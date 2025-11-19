/**
 @fileoverview Controlador de API para cambiar el rol asignado a un usuario. Este endpoint valida
 los datos recibidos, actualiza el rol en la base de datos, registra eventos de auditoría y retorna
 el perfil actualizado del usuario. Utiliza Prisma como ORM y servicios personalizados para validación
 y respuesta estandarizada. @module api/usuarios/cambiarRol
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarCambiarRol from "@/services/usuarios/validarCambiarRol"; // Servicio para validar el cambio de rol
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP PATCH para cambiar el rol de un usuario.
 * Valida los datos recibidos, actualiza el campo `id_rol` en la base de datos
 * y retorna una respuesta estructurada con el perfil actualizado del usuario.
 *
 * @async
 * @function PATCH
 * @param {Request} request - Solicitud HTTP con los IDs de usuario y rol.
 * @returns {Promise<Response>} Respuesta HTTP con el usuario actualizado o un mensaje de error.
 */

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { idRol, idUsuario } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarCambiarRol(idRol, idUsuario);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_CAMBIAR_ROL",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al cambiar rol al usuario",
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

    // 4. Ejecuta transacción: actualiza el rol y consulta el usuario actualizado
    const [cambiadoRol, usuarioActualizado] = await prisma.$transaction([
      prisma.usuario.update({
        where: { id: validaciones.id_usuario_rol },
        data: {
          id_rol: validaciones.id_rol,
        },
      }),

      prisma.usuario.findFirst({
        where: {
          id: validaciones.id_usuario_rol,
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
    if (!cambiadoRol || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_CAMBIAR_ROL",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo cambiar el rol al usuario",
        datosAntes: null,
        datosDespues: {
          cambiadoRol,
          usuarioActualizado,
        },
      });

      return generarRespuesta("error", "Error, al cambiar de rol...", {}, 400);
    }

    // 6. Registro exitoso del evento y retorno del usuario actualizado
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "UPDATE_CAMBIAR_ROL",
      id_objeto: usuarioActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Rol cambiado con exito",
      datosAntes: null,
      datosDespues: {
        cambiadoRol,
        usuarioActualizado,
      },
    });

    return generarRespuesta(
      "ok",
      "Cambio exitoso...",
      {
        usuarios: usuarioActualizado,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (cambiar de rol): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_CAMBIAR_ROL",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al cambiar rol de usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (cambiar de rol)",
      {},
      500
    );
  }
}
