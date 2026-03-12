/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de realizar una consulta
 de todos los estantes disponibles en la institucion.
 @module services/estantes/validarConsultarEstantesInstitucion
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida la identidad del usuario que intenta consultar todos los estantes disponibles por institucion.
 @async
 @function validarConsultarEstantesInstitucion
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarEstantesInstitucion() {
  try {
    // 1. Obtener y validar el correo del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Si todas las validaciones son correctas, se consolidan y retornan los datos del usuario.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_institucion: validaciones.id_institucion,
    });
  } catch (error) {
    // 4. Manejo de errores inesperados.
    console.log(
      `Error interno validar consultar estantes por institucion: ` + error,
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar estantes por institucion",
    );
  }
}
