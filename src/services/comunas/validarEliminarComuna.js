/**
 @fileoverview Función utilitaria para validar la identidad de la comuna, sus permisos
 y los parámetros necesarios antes de eliminar (desactivar) una comuna en el sistema.
 @module services/comunas/validarEliminarComuna
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad de la comuna, sus permisos y los parámetros requeridos para eliminar
 (desactivar) otra comuna. Verifica que el estado sea booleano y que el ID de la comuna
 objetiva sea válido.
 @async
 @function validarEliminarComuna
 @param {boolean} estado - Estado booleano que indica si se debe eliminar.
 @param {string|number} idComuna - Identificador único de la comuna a eliminar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEliminarComuna(estado, idComuna) {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Verificar si el usuario tiene permisos.
    if (validaciones.id_rol >= 4) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    // 4. Validar que el estado proporcionado sea booleano.
    if (estado !== true && estado !== false) {
      return retornarRespuestaFunciones(
        "error",
        "Error, opcion de eliminar invalida..."
      );
    }

    // 5. Validar que el ID de la comuna objetivo sea válido.
    const validarIdComuna = ValidarCampos.validarCampoId(idComuna, "comuna");

    // 6. Si el ID es inválido, retornar error.
    if (validarIdComuna.status === "error") {
      return retornarRespuestaFunciones(
        validarIdComuna.status,
        validarIdComuna.message
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      borrado: true,
      id_comuna: validarIdComuna.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar eliminar comuna: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar eliminar comuna"
    );
  }
}
