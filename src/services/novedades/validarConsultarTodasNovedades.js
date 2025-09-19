/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de consultar
 todas las novedades disponibles en el sistema, sin filtros por departamento o institución.
 @module services/novedades/validarConsultarTodasNovedades
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario que intenta consultar todas las novedades registradas.
 @async
 @function validarConsultarTodasNovedades
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarTodasNovedades() {
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

    // 3. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
    });
  } catch (error) {
    // 4. Manejo de errores inesperados.
    console.log("Error interno validar consultar todas novedades: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todas novedades"
    );
  }
}
