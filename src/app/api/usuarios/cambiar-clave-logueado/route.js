/**
 @fileoverview Controlador de API para cambiar la contraseña de un usuario logueado. Este endpoint
 valida las credenciales actuales, verifica la nueva contraseña, actualiza la clave en la base de
 datos y registra eventos de auditoría. Utiliza Prisma como ORM y servicios personalizados para
 validación y respuesta estandarizada. @module api/usuarios/cambiarClaveLogueado
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import validarCambiarClaveLogueado from "@/services/usuarios/validarCambiarClaveLogueado"; // Servicio para validar el cambio de clave
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP POST para cambiar la contraseña de un usuario logueado.
 * Valida las credenciales actuales, encripta la nueva contraseña,
 * actualiza el registro del usuario y retorna una respuesta estructurada.
 *
 * @async
 * @function POST
 * @param {Request} request - Solicitud HTTP con las claves actual y nueva.
 * @returns {Promise<Response>} Respuesta HTTP indicando éxito o error en el cambio de clave.
 */

export async function POST(request) {
  try {
    // 1. Extrae las claves del cuerpo de la solicitud
    const { claveVieja, claveUno, claveDos } = await request.json();

    // 2. Ejecuta la validación de las claves
    const validaciones = await validarCambiarClaveLogueado(
      claveVieja,
      claveUno,
      claveDos
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_CAMBIAR_CLAVE_LOGGEADO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al cambiar clave, usuario loggeado",
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

    // 4. Actualiza la clave del usuario en la base de datos
    const claveCambiadaUsuarioLoggueado = await prisma.usuario.update({
      where: { id: validaciones.id_usuario },
      data: { clave: validaciones.claveEncriptada },
    });

    // 5. Si la actualización falla, registra el error y retorna error 400
    if (!claveCambiadaUsuarioLoggueado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_CAMBIAR_CLAVE_LOGGUEADO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se puedo cambiar la clave de usuario loggueado",
        datosAntes: null,
        datosDespues: {
          claveCambiadaUsuarioLoggueado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, fallo al cambiar clave",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno de respuesta exitosa
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "UPDATE_CAMBIAR_CLAVE_LOGGUEADO",
      id_objeto: claveCambiadaUsuarioLoggueado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Cambio de clave exitoso usuario loggeado",
      datosAntes: null,
      datosDespues: claveCambiadaUsuarioLoggueado,
    });

    return generarRespuesta("ok", "Clave cambiada con exito...", {}, 201);
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno al cambiar clave loggeado: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_CAMBIO_CLAVE_LOGGUEADO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al cambiar clave loggueado",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno, al cambiar clave loggeado",
      {},
      500
    );
  }
}
