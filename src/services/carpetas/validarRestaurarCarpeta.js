/**
 @fileoverview Función utilitaria para validar la identidad de la carpeta, sus permisos
 y los parámetros necesarios antes de restaurar (activar) una carpeta en el sistema.
 @module services/carpetas/validarRestaurarCarpeta
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad de la carpeta, sus permisos y los parámetros requeridos para restaurar
 (activar) otra carpeta. Verifica que el estado sea booleano y que el ID de la carpeta objetivo
 sea válido.
 @async
 @function validarRestaurarCarpeta
 @param {boolean} estado - Estado booleano que indica si se debe restaurar.
 @param {string|number} idCarpeta - Identificador único de la carpeta a restaurar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarRestaurarCarpeta(estado, idCarpeta) {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Verificar si el usuario tiene permisos.
    if (validaciones.id_rol !== 1 && validaciones.id_rol !== 2) {
      return retornarRespuestaFunciones(
        "error",
        "Error usuario no tiene permisos",
      );
    }

    // 4. Validar que el estado proporcionado sea booleano.
    if (estado !== true && estado !== false) {
      return retornarRespuestaFunciones(
        "error",
        "Error, opcion de eliminar invalida",
      );
    }

    // 5. Validar que el ID de la carpeta objetivo sea válido.
    const validarIdCarpeta = ValidarCampos.validarCampoId(idCarpeta, "carpeta");

    // 6. Si el ID es inválido, retornar error.
    if (validarIdCarpeta.status === "error") {
      return retornarRespuestaFunciones(
        validarIdCarpeta.status,
        validarIdCarpeta.message,
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      borrado: false,
      id_carpeta: validarIdCarpeta.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar restaurar carpeta: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar restaurar carpeta",
    );
  }
}
