/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los parámetros necesarios
 antes de certificar un curso asociado a un vocero. @module services/cursos/validarCertificarCurso
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y los parámetros requeridos para certificar un curso vinculado a
 un vocero.
 @async
 @function validarCertificarCurso
 @param {string|number} id_curso - Identificador único del curso a certificar.
 @param {string|number} id_vocero - Identificador único del vocero asociado al curso.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCertificarCurso(
  id_curso,
  id_vocero,
  descripcion,
  fecha,
) {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar el campo id_curso.
    const validarIdCurso = ValidarCampos.validarCampoId(id_curso, "curso");

    // 4. Si el id del curso es inválido, se retorna un error.
    if (validarIdCurso.status === "error") {
      return retornarRespuestaFunciones(
        validarIdCurso.status,
        validarIdCurso.message,
      );
    }

    // 5. Validar el campo id_vocero.
    const validarIdVocero = ValidarCampos.validarCampoId(id_vocero, "vocero");

    // 6. Si el id del vocero es inválido, se retorna un error.
    if (validarIdVocero.status === "error") {
      return retornarRespuestaFunciones(
        validarIdVocero.status,
        validarIdVocero.message,
      );
    }

    // 7. Validar el campo descripcion.
    const validarDescripcion = ValidarCampos.validarCampoTexto(descripcion);

    // 8. Si el id del vocero es inválido, se retorna un error.
    if (validarDescripcion.status === "error") {
      return retornarRespuestaFunciones(
        validarDescripcion.status,
        validarDescripcion.message,
      );
    }

    const validarFecha = ValidarCampos.validarCampoFechaISO(fecha);

    // 9. Si la fecha de certificacion es inválida, se retorna un error.
    if (validarFecha.status === "error") {
      return retornarRespuestaFunciones(
        validarFecha.status,
        validarFecha.message,
      );
    }

    // 10. Si todas las validaciones son correctas, se retorna la información consolidada.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_curso: validarIdCurso.id,
      id_vocero: validarIdVocero.id,
      descripcion: validarDescripcion.texto,
      fecha: validarFecha.fecha,
    });
  } catch (error) {
    // 11. Manejo de errores inesperados.
    console.log("Error interno validar certificar curso: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar certificar curso",
    );
  }
}
