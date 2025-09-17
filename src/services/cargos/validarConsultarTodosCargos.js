/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de realizar una consulta
 de todos los cargos disponibles. @module services/cargos/validarConsultarTodos
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida la identidad del usuario que intenta consultar todos los cargos disponibles.
 @async
 @function validarConsultarTodosCargos
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarTodosCargos() {
  try {
    // 1. Obtener y validar el correo del usuario a través del token.
    const validaciones = obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Si todas las validaciones son correctas, se consolidan y retornan los datos del usuario.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
    });
  } catch (error) {
    // 4. Manejo de errores inesperados.
    console.log(`Error interno validar consultar todos cargos: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todos cargos"
    );
  }
}
