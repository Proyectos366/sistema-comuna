/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de realizar una consulta
 de todos las departamentos por idInstitucion.
 @module services/departamentos/validarConsultarDepartamentosIdInstitucion
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación
import ValidarCampos from "@/services/ValidarCampos";

/**
 Valida la identidad del usuario que intenta consultar todas lss departamentos por institucion.
 @async
 @function validarConsultarDepartamentosIdInstitucion
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarDepartamentosIdInstitucion(
  request
) {
  try {
    // 1. Extraer el parámetro 'idInstitucion' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idInstitucion = searchParams.get("idInstitucion");

    // 2. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Obtener y validar los datos del idInstitucion.
    const validarIdInstitucion = await ValidarCampos.validarCampoId(
      idInstitucion,
      "institucion"
    );

    // 3. Si el idInstitucion es inválido, se retorna un error.
    if (validarIdInstitucion.error === "error") {
      return retornarRespuestaFunciones(
        validarIdInstitucion.status,
        validarIdInstitucion.message
      );
    }

    // 4. Si todas las validaciones son correctas, se retorna la información del usuario.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_institucion: validarIdInstitucion.id,
    });
  } catch (error) {
    // 5. Manejo de errores inesperados.
    console.log(
      "Error interno validar consultar departamentos idInstitucion: " + error
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar departamentos idInstitucion"
    );
  }
}
