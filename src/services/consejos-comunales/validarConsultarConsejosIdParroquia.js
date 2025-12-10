/**
 @fileoverview Función utilitaria para validar la identidad del usuario y un ID de parroquia antes
 de consultar los consejos comunales. @module services/consejos/validarConsultarConsejosIdParroquia
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y el ID de la parroquia para consultar consejos comunales.
 @async
 @function validarConsultarConsejosIdParroquia
 @param {object} request - El objeto de solicitud HTTP que contiene los parámetros de la URL.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarConsejosIdParroquia(request) {
  try {
    // 1. Extraer el parámetro 'idParroquia' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idParroquia = searchParams.get("idParroquia");

    // 2. Obtener los datos del usuario activo a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Validar que el 'idParroquia' sea un ID válido.
    const validarIdParroquia = ValidarCampos.validarCampoId(
      idParroquia,
      "parroquia"
    );

    // 5. Si la validación del ID de la parroquia falla, se retorna un error.
    if (validarIdParroquia.status === "error") {
      return retornarRespuestaFunciones(
        validarIdParroquia.status,
        validarIdParroquia.message
      );
    }

    // 6. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_parroquia: validarIdParroquia.id,
    });
  } catch (error) {
    // 7. Manejo de errores inesperados.
    console.log(
      `Error interno validar consultar consejos id parroquia: ` + error
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar consultar consejos id parroquia"
    );
  }
}
