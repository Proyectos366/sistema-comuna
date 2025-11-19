/**
 @fileoverview Controlador de API para restaurar un usuario previamente marcado como eliminado.
 Este endpoint valida los datos recibidos, actualiza el estado del campo `borrado` en la base de
 datos, registra eventos de auditoría y retorna el perfil actualizado del usuario restaurado.
 Utiliza Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/usuarios/restaurarUsuario
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarUsuario from "@/services/usuarios/validarRestaurarUsuario"; // Servicio para validar la restauración de usuario
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP PATCH para restaurar un usuario previamente eliminado.
 * Valida los datos recibidos, actualiza el estado del campo `borrado` en la base de datos
 * y retorna una respuesta estructurada con el perfil actualizado del usuario.
 *
 * @async
 * @function PATCH
 * @param {Request} request - Solicitud HTTP con el estado de restauración y el ID del usuario.
 * @returns {Promise<Response>} Respuesta HTTP con el usuario restaurado o un mensaje de error.
 */

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_usuario } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarUsuario(estado, id_usuario);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al restaurar usuario",
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

    // 4. Ejecuta transacción: actualiza el estado de borrado y consulta el usuario actualizado
    const [restaurandoUsuario, usuarioActualizado] = await prisma.$transaction([
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

    // 5. Si no se obtiene el usuario o la restauración falla, registra el error y retorna
    if (!restaurandoUsuario || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_RESTAURAR_USUARIO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo restaurar el usuario",
        datosAntes: null,
        datosDespues: {
          restaurandoUsuario,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al restaurar usuario...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno del usuario restaurado
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "RESTAURAR_USUARIO",
      id_objeto: usuarioActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Usuario restaurado con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoUsuario,
        usuarioActualizado,
      },
    });

    return generarRespuesta(
      "ok",
      "Usuario restaurado correctamente...",
      {
        usuarios: usuarioActualizado,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (restaurar usuario): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al restaurar usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar usuario)",
      {},
      500
    );
  }
}
