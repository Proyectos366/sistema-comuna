/**
 @fileoverview Controlador de API para cambiar el departamento asignado a un usuario. Este endpoint
 valida los datos recibidos, actualiza la relación en la base de datos, registra eventos de auditoría
 y retorna el perfil actualizado del usuario. Utiliza Prisma como ORM y servicios personalizados
 para validación y respuesta estandarizada. @module api/usuarios/cambiarAlDepartamento
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarCambiarAlDepartamento from "@/services/usuarios/validarCambiarAlDepartamento"; // Servicio para validar el cambio de departamento
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP PATCH para cambiar el departamento de un usuario.
 * Valida los datos recibidos, actualiza la relación en la base de datos
 * y retorna una respuesta estructurada con el perfil actualizado del usuario.
 *
 * @async
 * @function PATCH
 * @param {Request} request - Solicitud HTTP con los IDs de usuario y departamento.
 * @returns {Promise<Response>} Respuesta HTTP con el usuario actualizado o un mensaje de error.
 */

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { idDepartamento, idUsuario } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarCambiarAlDepartamento(
      idDepartamento,
      idUsuario
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_CAMBIAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al cambiar un usuario de departamento",
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

    // 4. Ejecuta transacción: actualiza el departamento y consulta el usuario actualizado
    const [cambiadoALDepartamento, usuarioActualizado] =
      await prisma.$transaction([
        prisma.usuario.update({
          where: { id: validaciones.id_usuario_miembro },
          data: {
            MiembrosDepartamentos: {
              set: [{ id: validaciones.id_departamento }],
            },
          },
        }),

        prisma.usuario.findFirst({
          where: {
            id: validaciones.id_usuario_miembro,
            borrado: false,
          },
          orderBy: { nombre: "asc" },
          include: { MiembrosDepartamentos: true },
        }),
      ]);

    // 5. Si no se obtiene el usuario o la actualización falla, registra el error y retorna
    if (!cambiadoALDepartamento || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_CAMBIAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo cambiar al usuario de departamento",
        datosAntes: null,
        datosDespues: {
          cambiadoALDepartamento,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al cambiar de departamento...",
        {},
        !cambiadoALDepartamento ? 400 : 404
      );
    }

    // 6. Registro exitoso del evento y retorno del usuario actualizado
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "UPDATE_CAMBIAR_DEPARTAMENTO",
      id_objeto: usuarioActualizado?.MiembrosDepartamentos?.[0]?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Usuario cambiado con exito al departamento ${usuarioActualizado?.MiembrosDepartamentos?.[0]?.nombre}`,
      datosAntes: null,
      datosDespues: {
        cambiadoALDepartamento,
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
    console.log(`Error interno (cambiar al departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_CAMBIAR_DEPARTAMENTO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al cambiar usuario de departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (cambiar al departamento)",
      {},
      500
    );
  }
}
