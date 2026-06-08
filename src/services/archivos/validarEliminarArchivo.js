/**
 @fileoverview Función utilitaria para validar la identidad del archivo, sus permisos
 y los parámetros necesarios antes de eliminar (desactivar) un archivo en el sistema.
 @module services/archivos/validarEliminarArchivo
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del archivo, sus permisos y los parámetros requeridos para eliminar
 (desactivar) otro archivo. Verifica que el estado sea booleano y que el ID del archivo
 objetivo sea válido.
 @async
 @function validarEliminarArchivo
 @param {boolean} estado - Estado booleano que indica si se debe eliminar.
 @param {string|number} idArchivo - Identificador único del archivo a eliminar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEliminarArchivo(estado, idArchivo) {
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
    if (
      validaciones.id_rol !== 1 &&
      validaciones.id_rol !== 2 &&
      validaciones.id_rol !== 3
    ) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos",
        { codigo: 403 },
      );
    }

    // 4. Validar que el estado proporcionado sea booleano.
    if (estado !== true && estado !== false) {
      return retornarRespuestaFunciones(
        "error",
        "Error, opcion de eliminar invalida",
      );
    }

    // 5. Validar que el ID del archivo objetivo sea válido.
    const validarIdArchivo = ValidarCampos.validarCampoId(idArchivo, "archivo");

    // 6. Si el ID es inválido, retornar error.
    if (validarIdArchivo.status === "error") {
      return retornarRespuestaFunciones(
        validarIdArchivo.status,
        validarIdArchivo.message,
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      borrado: true,
      id_archivo: validarIdArchivo.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar eliminar archivo: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar eliminar archivo",
    );
  }
}
