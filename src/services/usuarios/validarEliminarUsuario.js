/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de eliminar (desactivar) un usuario en el sistema.
 @module services/usuarios/validarEliminarUsuario
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario, sus permisos y los parámetros requeridos para eliminar (desactivar) otro usuario.
 Verifica que el estado sea booleano y que el ID del usuario objetivo sea válido.
 @async
 @function validarEliminarUsuario
 @param {boolean} estado - Estado booleano que indica si se debe eliminar (true) o restaurar (false) el usuario.
 @param {string|number} idUsuario - Identificador único del usuario a eliminar o restaurar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEliminarUsuario(estado, idUsuario) {
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

    // 3. Verificar si el usuario tiene permisos (rol 1 = master, rol 2 = administrador).
    if (validaciones.id_rol !== 1 && validaciones.id_rol !== 2) {
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

    // 5. Validar que el ID del usuario objetivo sea válido.
    const validarIdUsuario = ValidarCampos.validarCampoId(idUsuario, "usuario");

    // 6. Si el ID es inválido, retornar error.
    if (validarIdUsuario.status === "error") {
      return retornarRespuestaFunciones(
        validarIdUsuario.status,
        validarIdUsuario.message
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      borrado: true,
      id_usuario_estado: validarIdUsuario.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar eliminar usuario: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar eliminar usuario"
    );
  }
}
