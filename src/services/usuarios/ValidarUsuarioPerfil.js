/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de consultar
 su perfil personal dentro del sistema.
 @module services/usuarios/validarUsuarioPerfil
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario que intenta acceder a su perfil.
 Retorna los datos básicos del usuario si la validación es exitosa.
 @async
 @function validarUsuarioPerfil
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarUsuarioPerfil() {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
    });
  } catch (error) {
    // 4. Manejo de errores inesperados.
    console.log("Error interno validar usuario perfil: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar usuario perfil"
    );
  }
}
