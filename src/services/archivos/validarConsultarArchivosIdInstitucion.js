/**
 @fileoverview Función utilitaria para validar la identidad del usuario y un ID de institucion antes
 de consultar los archivos.
 @module services/archivos/validarConsultarArchivosIdInstitucion
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y el ID de la institucion para consultar archivos.
 @async
 @function validarConsultarArchivosIdInstitucion
 @param {object} request - El objeto de solicitud HTTP que contiene los parámetros de la URL.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarArchivosIdInstitucion(request) {
  try {
    // 1. Extraer el parámetro 'idInstitucion' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idInstitucion = searchParams.get("idInstitucion");

    // 2. Obtener los datos del usuario activo a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 4. Validar que el 'idInstitucion' sea un ID válido.
    const validarIdInstitucion = ValidarCampos.validarCampoId(
      idInstitucion,
      "institucion",
    );

    // 5. Si la validación del ID de la institucion falla, se retorna un error.
    if (validarIdInstitucion.status === "error") {
      return retornarRespuestaFunciones(
        validarIdInstitucion.status,
        validarIdInstitucion.message,
      );
    }

    // 6. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_institucion: validarIdInstitucion.id,
    });
  } catch (error) {
    // 7. Manejo de errores inesperados.
    console.log(
      `Error interno validar consultar archivos id institucion: ` + error,
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar archivos id institucion",
    );
  }
}
