/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de realizar una consulta
 de todos los Municipios por idEstado. @module services/municipios/validarConsultarMunicipiosIdEstado
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación
import ValidarCampos from "../ValidarCampos";

/**
 Valida la identidad del usuario que intenta consultar todos los Municipios por estado.
 @async
 @function validarConsultarMunicipiosIdEstado
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarMunicipiosIdEstado(request) {
  try {
    // 1. Extraer el parámetro 'idEstado' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idEstado = searchParams.get("idEstado");

    // 2. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Obtener y validar los datos del idEstado.
    const validarIdEstado = await ValidarCampos.validarCampoId(
      idEstado,
      "estado"
    );

    // 3. Si el idEstado es inválido, se retorna un error.
    if (validarIdEstado.error === "error") {
      return retornarRespuestaFunciones(
        validarIdEstado.status,
        validarIdEstado.message
      );
    }

    // 4. Si todas las validaciones son correctas, se retorna la información del usuario.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_estado: validarIdEstado.id,
    });
  } catch (error) {
    // 5. Manejo de errores inesperados.
    console.log(
      "Error interno validar consultar Municipios idEstado: " + error
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar Municipios idEstado"
    );
  }
}
