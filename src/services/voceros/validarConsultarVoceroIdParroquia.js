import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarVoceroIdParroquia(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParroquia = searchParams.get("idParroquia");

    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarIdParroquia = ValidarCampos.validarCampoId(
      idParroquia,
      "parroquia"
    );

    if (validarIdParroquia.status === "error") {
      return retornarRespuestaFunciones(
        validarIdParroquia.status,
        validarIdParroquia.message
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_parroquia: validarIdParroquia.id,
    });
  } catch (error) {
    console.log("Error interno validar vocero id_parroquia: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar vocero id_parroquia"
    );
  }
}


/**
 * @fileoverview Función utilitaria para validar la identidad del usuario y el parámetro
 * de parroquia recibido en la URL antes de consultar voceros asociados a dicha parroquia.
 * @module services/voceros/validarConsultarVoceroIdParroquia
 */

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo mediante el token de autenticación

/**
 * Valida el token del usuario activo y el parámetro 'idParroquia' recibido en la URL.
 * Retorna los datos validados si todo es correcto.
 * @async
 * @function validarConsultarVoceroIdParroquia
 * @param {Request} request - Objeto de solicitud HTTP que contiene la URL con parámetros.
 * @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
 */
export default async function validarConsultarVoceroIdParroquia(request) {
  try {
    // 1. Extraer el parámetro 'idParroquia' desde la URL del request.
    const { searchParams } = new URL(request.url);
    const idParroquia = searchParams.get("idParroquia");

    // 2. Validar identidad del usuario activo mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Validar que el ID de parroquia sea válido.
    const validarIdParroquia = ValidarCampos.validarCampoId(
      idParroquia,
      "parroquia"
    );

    // 5. Si el ID de parroquia es inválido, retornar error.
    if (validarIdParroquia.status === "error") {
      return retornarRespuestaFunciones(
        validarIdParroquia.status,
        validarIdParroquia.message
      );
    }

    // 6. Si todas las validaciones son correctas, retornar los datos consolidados.
    return retornarRespuestaFunciones("ok", "Validación correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_parroquia: validarIdParroquia.id,
    });
  } catch (error) {
    // 7. Manejo de errores inesperados.
    console.log("Error interno validar vocero id_parroquia: " + error);

    return retornarRespuestaFunciones(
      "error",
      "Error interno validar vocero id_parroquia"
    );
  }
}
