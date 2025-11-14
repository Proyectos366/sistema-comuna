/**
 @fileoverview Función utilitaria para validar la identidad de la institucion, sus permisos
 y los parámetros necesarios antes de restaurar (activar) una institucion en el sistema.
 @module services/instituciones/validarRestaurarInstitucion
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad de la institucion, sus permisos y los parámetros requeridos para restaurar
 (activar) otra institucion. Verifica que el estado sea booleano y que el ID de la institucion objetivo
 sea válido.
 @async
 @function validarRestaurarInstitucion
 @param {boolean} estado - Estado booleano que indica si se debe restaurar.
 @param {string|number} idInstitucion - Identificador único de la institucion a restaurar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarRestaurarInstitucion(estado, idInstitucion) {
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

    // 3. Verificar si el usuario tiene permisos (rol 1 = master).
    if (validaciones.id_rol !== 1) {
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

    // 5. Validar que el ID de la institucion objetivo sea válido.
    const validarIdInstitucion = ValidarCampos.validarCampoId(
      idInstitucion,
      "institucion"
    );

    // 6. Si el ID es inválido, retornar error.
    if (validarIdInstitucion.status === "error") {
      return retornarRespuestaFunciones(
        validarIdInstitucion.status,
        validarIdInstitucion.message
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      borrado: false,
      id_institucion: validarIdInstitucion.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar restaurar institucion: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar restaurar institucion"
    );
  }
}
