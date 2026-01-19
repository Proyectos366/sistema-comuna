/**
 @fileoverview Función utilitaria para validar la identidad del usuario y un ID de formacion
 antes de consultar los participantes.
 @module services/participantes/validarConsultarParticipantesIdFormacion
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y el ID de la formacion para consultar participantes.
 @async
 @function validarConsultarParticipantesIdFormacion
 @param {object} request - El objeto de solicitud HTTP que contiene los parámetros de la URL.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarParticipantesIdFormacion(
  request
) {
  try {
    // 1. Extraer el parámetro 'idFormacion' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idFormacion = searchParams.get("idFormacion");

    // 2. Obtener los datos del usuario activo a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Validar que el 'idFormacion' sea un ID válido.
    const validarIdFormacion = ValidarCampos.validarCampoId(
      idFormacion,
      "formacion"
    );

    // 5. Si la validación del ID de la formacion falla, se retorna un error.
    if (validarIdFormacion.status === "error") {
      return retornarRespuestaFunciones(
        validarIdFormacion.status,
        validarIdFormacion.message
      );
    }

    // 6. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_formacion: validarIdFormacion.id,
    });
  } catch (err) {
    // 7. Manejo de errores inesperados.
    console.log(
      `Error interno validar consultar participantes idFormacion: ` + err
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar participantes idFormacion"
    );
  }
}
