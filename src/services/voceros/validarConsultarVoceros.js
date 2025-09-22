import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarTodosVoceros() {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permiso..."
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
    });
  } catch (error) {
    console.log("Error interno validar consultar todos voceros: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todos voceros"
    );
  }
}

/**
 * @fileoverview Función utilitaria para validar la identidad del usuario y sus permisos
 * antes de permitir la consulta de todos los voceros registrados en el sistema.
 * @module services/voceros/validarConsultarTodosVoceros
 */

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo mediante el token de autenticación

/**
 * Valida si el usuario tiene permisos suficientes para consultar todos los voceros.
 * Solo los usuarios con rol 1 (administrador) tienen acceso autorizado.
 * @async
 * @function validarConsultarTodosVoceros
 * @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
 */
export default async function validarConsultarTodosVoceros() {
  try {
    // 1. Obtener y validar los datos del usuario activo mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido o la sesión no es válida, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Verificar si el usuario tiene rol de administrador (rol 1).
    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permiso..."
      );
    }

    // 4. Si todas las validaciones son correctas, retornar los datos consolidados.
    return retornarRespuestaFunciones("ok", "Validación correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
    });
  } catch (error) {
    // 5. Manejo de errores inesperados.
    console.log("Error interno validar consultar todos voceros: " + error);

    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todos voceros"
    );
  }
}
