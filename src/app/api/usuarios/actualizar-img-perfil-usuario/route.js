/**
 @fileoverview Controlador de API para crear o actualizar la imagen de perfil de un usuario. Este
 endpoint valida los datos recibidos, registra eventos según el resultado, realiza la transacción
 para guardar la imagen y retorna el perfil actualizado del usuario. Utiliza Prisma como ORM,
 servicios personalizados para validación y auditoría, y una utilidad para respuestas HTTP
 estandarizadas. @module api/usuarios/crearCambiarImgPerfil
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría
import validarCrearCambiarImgPerfil from "@/services/usuarios/validarCrearCambiarImgPerfil"; // Servicio para validar datos de imagen de perfil

/**
 * Maneja las solicitudes HTTP POST para crear o actualizar la imagen de perfil de un usuario.
 * Valida los datos recibidos, registra eventos de auditoría, guarda la imagen en la base de datos
 * y retorna el perfil actualizado del usuario.
 *
 * @async
 * @function POST
 * @param {Request} request - Solicitud HTTP con los datos de la imagen.
 * @returns {Promise<Response>} Respuesta HTTP con el perfil actualizado o mensaje de error.
 */

export async function POST(request) {
  try {
    // 1. Ejecuta la validación de los datos recibidos
    const validaciones = await validarCrearCambiarImgPerfil(request);

    // 2. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_IMG_PERFIL",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al intentar actualizar la imagen de perfil",
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

    // 3. Ejecuta transacción: guarda imagen y consulta perfil actualizado
    const [cambiarImgPerfil, usuarioActualizado] = await prisma.$transaction([
      prisma.imagen.create({
        data: {
          nombreOriginal: validaciones.nombreOriginal,
          nombreSistema: validaciones.nombreSistema,
          path: validaciones.path,
          tipo: validaciones.tipoImagen,
          formato: validaciones.extensionImagen,
          peso: validaciones.sizeImagen,
          id_usuario: validaciones.id_usuario,
        },
      }),

      prisma.usuario.findUnique({
        where: { id: validaciones.id_usuario },
        select: {
          id: true,
          nombre: true,
          apellido: true,
          cedula: true,
          correo: true,
          id_rol: true,
          borrado: true,
          validado: true,
          clave: true,
          createdAt: true,
          MiembrosDepartamentos: {
            select: {
              id: true,
              nombre: true,
            },
          },
          imagenes: {
            orderBy: {
              createdAt: "desc", // Más reciente primero
            },
            take: 1, // Solo la última imagen
            select: {
              id: true,
              path: true,
            },
          },
          roles: {
            select: {
              nombre: true,
            },
          },
        },
      }),
    ]);

    // 4. Si no se obtiene el usuario actualizado, registra el error y retorna error 400
    if (!usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_IMAGEN_PERFIL",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la imagen de perfil",
        datosAntes: null,
        datosDespues: usuarioActualizado,
      });

      return generarRespuesta(
        "error",
        "No se actualizo la imagen de perfil",
        {},
        400
      );
    }

    // 5. Registro exitoso del evento y retorno del perfil actualizado
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "UPDATE_IMAGEN_PERFIL",
      id_objeto: usuarioActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `La imagen del perfil se actualizo con exito...`,
      datosAntes: validaciones.usuarioAntes,
      datosDespues: usuarioActualizado,
    });

    return generarRespuesta(
      "ok",
      "Se actualizo la imagen de perfil...",
      { usuarioPerfil: usuarioActualizado },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.error("Error interno al actualizar imagen de perfil: ", +error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_IMAGEN_PERFIL",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la imagen de perfil",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno al actualizar imagen de perfil...",
      {},
      500
    );
  }
}
