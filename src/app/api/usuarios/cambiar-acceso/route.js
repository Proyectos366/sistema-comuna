/**
 @fileoverview Controlador de API para cambiar el estado de acceso de un usuario. Este endpoint
 permite autorizar o restringir el acceso de inicio de sesión de un usuario. Valida los datos
 recibidos, actualiza el estado en la base de datos, registra eventos de auditoría y retorna el
 perfil actualizado del usuario. Utiliza Prisma como ORM y servicios personalizados para validación
 y respuesta estandarizada. @module api/usuarios/cambiarAcceso
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarCambiarAcceso from "@/services/usuarios/validarCambiarAcceso"; // Servicio para validar el cambio de acceso
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP PATCH para cambiar el estado de acceso de un usuario.
 * Valida los datos recibidos, actualiza el campo `validado` en la base de datos
 * y retorna una respuesta estructurada con el perfil actualizado del usuario.
 *
 * @async
 * @function PATCH
 * @param {Request} request - Solicitud HTTP con los datos de validación y el ID del usuario.
 * @returns {Promise<Response>} Respuesta HTTP con el usuario actualizado o un mensaje de error.
 */

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { validado, idUsuario } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarCambiarAcceso(validado, idUsuario);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_AUTORIZAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al autenticar usuario para inicio de sesion",
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

    // 4. Ejecuta transacción: actualiza el estado de acceso y consulta el usuario actualizado
    const [cambiandoAcceso, usuarioActualizado] = await prisma.$transaction([
      prisma.usuario.update({
        where: { id: validaciones.id_usuario_validado },
        data: {
          validado: validaciones.validado,
        },
      }),

      prisma.usuario.findFirst({
        where: {
          id: validaciones.id_usuario_validado,
        },
        orderBy: { nombre: "asc" },
        include: { MiembrosDepartamentos: true },
      }),
    ]);

    // 5. Si no se obtiene el usuario o la actualización falla, registra el error y retorna
    if (!cambiandoAcceso || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: validaciones.validado
          ? "ERROR_UPDATE_AUTORIZADO"
          : "ERROR_UPDATE_RESTRINGIDO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: validaciones.validado
          ? "No se pudo autorizar el usuario para inicio de sesion"
          : "No se pudo restringir el usuario para inicio de sesion",
        datosAntes: null,
        datosDespues: {
          cambiandoAcceso,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al cambiar acceso...",
        {},
        !cambiandoAcceso ? 400 : 404
      );
    }

    // 6. Registro exitoso del evento y retorno del usuario actualizado
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: validaciones.validado
        ? "UPDATE_AUTORIZADO"
        : "UPDATE_RESTRINGIDO",
      id_objeto: usuarioActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: validaciones.validado
        ? "Usuario se autorizo para inicio de sesion"
        : "Usuario se restringio para inicio de sesion",
      datosAntes: null,
      datosDespues: {
        cambiandoAcceso,
        usuarioActualizado,
      },
    });

    return generarRespuesta(
      "ok",
      "Cambio exitoso...",
      {
        usuario: usuarioActualizado,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (cambiar acceso): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_AUTORIZAR",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al autorizar usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (cambiar acceso)",
      {},
      500
    );
  }
}
