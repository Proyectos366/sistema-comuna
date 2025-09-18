/**
 @fileoverview Controlador de API para consultar los datos del usuario activo mediante validación de
 token. Este endpoint ejecuta una validación personalizada, consulta el perfil del usuario en la base
 de datos y retorna sus datos junto al departamento asociado. Registra eventos de auditoría en cada
 paso. Utiliza Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/usuarios/consultarUsuarioActivo
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría
import validarUsuarioActivo from "@/services/usuarios/validarUsuarioActivo";
// Servicio para validar el token y obtener el correo

/**
 * Maneja las solicitudes HTTP GET para obtener los datos del usuario activo.
 * Ejecuta una validación personalizada, consulta el perfil del usuario
 * y retorna una respuesta estructurada con sus datos y departamento asociado.
 *
 * @async
 * @function GET
 * @param {Request} request - Solicitud HTTP que contiene el contexto del usuario.
 * @returns {Promise<Response>} Respuesta HTTP con los datos del usuario o mensaje de error.
 */

export async function GET(request) {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await validarUsuarioActivo();

    // 2. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_USUARIO_ACTIVO",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Token invalido para consultar usuario activo",
        datosAntes: null,
        datosDespues: descifrarToken,
      });

      return generarRespuesta(
        descifrarToken.status,
        descifrarToken.message,
        {},
        400
      );
    }

    // 3. Consulta el perfil del usuario usando el correo validado
    const datosUsuarioActivo = await prisma.usuario.findFirst({
      where: { correo: validaciones.correo },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        correo: true,
        id_rol: true,
        borrado: true,
        validado: true,
        createdAt: true,
        MiembrosInstitucion: {
          select: {
            id: true,
            nombre: true,
          },
        },
        MiembrosDepartamentos: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    // 4. Si no se encuentra el usuario, registra el error y retorna error 400
    if (!datosUsuarioActivo) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_GET_DATOS_USUARIO_LOGIN",
        id_objeto: 0,
        id_usuario: 0,
        descripcion:
          "No se pudo obtener los datos del usuario para iniciar sesion",
        datosAntes: null,
        datosDespues: null,
      });

      return generarRespuesta("error", "Error, usuario no activo", {}, 400);
    }

    // 5. Registro exitoso del evento y retorno de los datos del usuario
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "GET_DATOS_USUARIO_LOGIN",
      id_objeto: 0,
      id_usuario: datosUsuarioActivo.id,
      descripcion: "Se obtuvieron los datos de usuario para inicio de sesion",
      datosAntes: null,
      datosDespues: {
        datosUsuarioActivo,
      },
    });

    return generarRespuesta(
      "ok",
      "Usuario activo",
      {
        usuarioActivo: datosUsuarioActivo,
        departamento:
          datosUsuarioActivo?.MiembrosDepartamentos &&
          datosUsuarioActivo?.MiembrosDepartamentos.length > 0
            ? datosUsuarioActivo.MiembrosDepartamentos[0]
            : null,
      },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno, usuario activo: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_USUARIO_ACTIVO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion:
        "Error inesperado al consultar los datos de inicio de sesion",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error interno, usuario activo", {}, 500);
  }
}
