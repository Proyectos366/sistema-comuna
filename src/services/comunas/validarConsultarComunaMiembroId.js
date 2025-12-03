/**
 @fileoverview Función utilitaria para validar la identidad del usuario y sus permisos
 antes de consultar la comuna asociada al miembro por su ID.
 @module services/comunas/validarConsultarComunaMiembroId
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y sus permisos para consultar la comuna asociada al miembro.
 @async
 @function validarConsultarComunaMiembroId
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarComunaMiembroId() {
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

    // 4. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_comuna: validaciones.id_comuna,
    });
  } catch (err) {
    // 5. Manejo de errores inesperados.
    console.log("Error interno validar consultar comuna miembro: " + err);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar comuna miembro"
    );
  }
}
