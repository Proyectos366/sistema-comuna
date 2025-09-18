/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de realizar una
 consulta de todos los departamentos disponibles en su institución.
 @module services/departamentos/validarConsultarTodosDepartamentos
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario que intenta consultar todos los departamentos disponibles.
 @async
 @function validarConsultarTodosDepartamentos
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarTodosDepartamentos() {
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

    // 3. Si todas las validaciones son correctas, se retorna la información del usuario.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_institucion: validaciones.id_institucion,
    });
  } catch (erro) {
    // 4. Manejo de errores inesperados.
    console.log("Error interno validar consultar todos departamentos: " + erro);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todos departamentos"
    );
  }
}
