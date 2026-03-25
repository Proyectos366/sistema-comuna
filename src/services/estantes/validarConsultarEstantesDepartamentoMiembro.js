/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de realizar una consulta
 de todos los estantes disponibles pentenecientes a su departamento.
 @module services/estantes/validarConsultarEstantesDepartamentoMiembro
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida la identidad del usuario que intenta consultar todos los estantes disponibles
 pertenecientes a su departamento.
 @async
 @function validarConsultarEstantesDepartamentoMiembro
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarEstantesDepartamentoMiembro() {
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
      id_departamento: validaciones.id_departamento,
    });
  } catch (error) {
    // 4. Manejo de errores inesperados.
    console.log(
      `Error interno validar consultar estantes por miembro departamento: ` +
        error,
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar estantes por miembro departamento",
    );
  }
}
