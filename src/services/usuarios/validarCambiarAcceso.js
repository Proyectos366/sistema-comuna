/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de cambiar el estado de acceso de otro usuario.
 @module services/usuarios/validarCambiarAcceso
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los datos del usuario activo, el estado de acceso solicitado y el ID del usuario objetivo.
 Solo usuarios con rol 1 (administrador) o rol 2 (gestor) pueden realizar esta acción.
 @async
 @function validarCambiarAcceso
 @param {boolean} validado - Estado actual del acceso (true = activo, false = inactivo).
 @param {string|number} idUsuario - Identificador del usuario cuyo acceso se desea cambiar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCambiarAcceso(validado, idUsuario) {
  try {
    // 1. Validar identidad del usuario activo mediante el token.
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

    // 4. Validar que el parámetro 'validado' sea booleano.
    if (validado !== true && validado !== false) {
      return retornarRespuestaFunciones("error", "Error, validado inválido...");
    }

    // 5. Validar el ID del usuario objetivo.
    const validarIdUsuario = ValidarCampos.validarCampoId(idUsuario, "usuario");

    // 6. Si el ID del usuario es inválido, retornar error.
    if (validarIdUsuario.status === "error") {
      return retornarRespuestaFunciones(
        validarIdUsuario.status,
        validarIdUsuario.message
      );
    }

    // 7. Si todas las validaciones son correctas, retornar los datos consolidados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      validado: validado ? false : true, // Se invierte el valor de 'validado' para reflejar el cambio de estado.
      id_usuario_validado: validarIdUsuario.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar cambiar acceso: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar cambiar acceso"
    );
  }
}
