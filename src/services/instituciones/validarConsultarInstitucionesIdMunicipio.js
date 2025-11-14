/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de realizar una consulta
 de todos las instituciones por idMunicipio.
 @module services/instituciones/validarConsultarInstitucionesIdMunicipio
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación
import ValidarCampos from "@/services/ValidarCampos";

/**
 Valida la identidad del usuario que intenta consultar todas las instituciones por municipio.
 @async
 @function validarConsultarInstitucionesIdMunicipio
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarInstitucionesIdMunicipio(
  request
) {
  try {
    // 1. Extraer el parámetro 'idMunicipio' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idMunicipio = searchParams.get("idMunicipio");

    // 2. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Obtener y validar los datos del idMunicipio.
    const validarIdMunicipio = await ValidarCampos.validarCampoId(
      idMunicipio,
      "municipio"
    );

    // 3. Si el idMunicipio es inválido, se retorna un error.
    if (validarIdMunicipio.error === "error") {
      return retornarRespuestaFunciones(
        validarIdMunicipio.status,
        validarIdMunicipio.message
      );
    }

    // 4. Si todas las validaciones son correctas, se retorna la información del usuario.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_municipio: validarIdMunicipio.id,
    });
  } catch (error) {
    // 5. Manejo de errores inesperados.
    console.log(
      "Error interno validar consultar instituciones idMunicipio: " + error
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar instituciones idMunicipio"
    );
  }
}
