/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los parámetros
 necesarios antes de verificar la relación entre un curso y un vocero.
 @module services/cursos/validarVerificarCurso
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y los parámetros requeridos para verificar un curso y su vocero.
 @async
 @function validarVerificarCurso
 @param {string|number} id_curso - Identificador único del curso a verificar.
 @param {string|number} id_vocero - Identificador único del vocero asociado al curso.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarVerificarCurso(id_curso, id_vocero) {
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

    // 3. Validar el campo id_curso.
    const validarIdCurso = ValidarCampos.validarCampoId(id_curso, "curso");

    // 4. Validar el campo id_vocero.
    const validarIdVocero = ValidarCampos.validarCampoId(id_vocero, "vocero");

    // 5. Si el id del curso es inválido, se retorna un error.
    if (validarIdCurso.status === "error") {
      return retornarRespuestaFunciones(
        validarIdCurso.status,
        validarIdCurso.message
      );
    }

    // 6. Si el id del vocero es inválido, se retorna un error.
    if (validarIdVocero.status === "error") {
      return retornarRespuestaFunciones(
        validarIdVocero.status,
        validarIdVocero.message
      );
    }

    // 7. Si todas las validaciones son correctas, se retorna la información consolidada.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_curso: validarIdCurso.id,
      id_vocero: validarIdVocero.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno al validar curso: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno al validar curso"
    );
  }
}
