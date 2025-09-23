/**
 @fileoverview Función utilitaria para validar la identidad del usuario y el formato
 de la cédula antes de consultar información del vocero asociado.
 @module services/voceros/validarConsultarVoceroCedula
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo mediante el token de autenticación
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales

/**
 Valida el token del usuario activo y el formato de la cédula proporcionada.
 Retorna los datos validados si todo es correcto.
 @async
 @function validarConsultarVoceroCedula
 @param {string|number} cedula - Cédula del vocero que se desea consultar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarVoceroCedula(cedula) {
  try {
    // 1. Validar identidad del usuario activo mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido o la sesión no es válida, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Validar que la cédula tenga un formato correcto.
    const validarCedula = ValidarCampos.validarCampoCedula(cedula);

    // 4. Si la cédula es inválida, retornar error.
    if (validarCedula.status === "error") {
      return retornarRespuestaFunciones(
        validarCedula.status,
        validarCedula.message
      );
    }

    // 5. Si todas las validaciones son correctas, retornar los datos consolidados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      cedula: validarCedula.cedula,
    });
  } catch (error) {
    // 6. Manejo de errores inesperados.
    console.log("Error interno validar usuario cedula: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar usuario cedula"
    );
  }
}
