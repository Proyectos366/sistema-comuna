/**
 @fileoverview Función utilitaria para validar la identidad del circuito, sus permisos
 y los parámetros necesarios antes de eliminar (desactivar) un circuito en el sistema.
 @module services/circuitos/validarEliminarCircuito
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del circuito, sus permisos y los parámetros requeridos para eliminar
 (desactivar) otro circuito. Verifica que el estado sea booleano y que el ID del circuito
 objetiva sea válido.
 @async
 @function validarEliminarCircuito
 @param {boolean} estado - Estado booleano que indica si se debe eliminar.
 @param {string|number} idCircuito - Identificador único del circuito a eliminar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEliminarCircuito(estado, idCircuito) {
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

    // 5. Validar que el ID del circuito objetivo sea válido.
    const validarIdCircuito = ValidarCampos.validarCampoId(
      idCircuito,
      "circuito"
    );

    // 6. Si el ID es inválido, retornar error.
    if (validarIdCircuito.status === "error") {
      return retornarRespuestaFunciones(
        validarIdCircuito.status,
        validarIdCircuito.message
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      borrado: true,
      id_circuito: validarIdCircuito.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar eliminar circuito: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar eliminar circuito"
    );
  }
}
