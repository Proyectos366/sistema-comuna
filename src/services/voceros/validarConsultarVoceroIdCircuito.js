/**
 @fileoverview Función utilitaria para validar la identidad del usuario y el parámetro
 de circuito recibido en la URL antes de consultar voceros asociados a dicho circuito.
 @module services/voceros/validarConsultarVoceroIdCircuito
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo mediante el token de autenticación

/**
 Valida el token del usuario activo y el parámetro 'idCircuito' recibido en la URL.
 Retorna los datos validados si todo es correcto.
 @async
 @function validarConsultarVoceroIdCircuito
 @param {Request} request - Objeto de solicitud HTTP que contiene la URL con parámetros.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarVoceroIdCircuito(request) {
  try {
    // 1. Extraer el parámetro 'idCircuito' desde la URL del request.
    const { searchParams } = new URL(request.url);
    const idCircuito = searchParams.get("idCircuito");

    // 2. Validar identidad del usuario activo mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido o la sesión no es válida, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Validar que el ID del circuito sea válido.
    const validarIdCircuito = ValidarCampos.validarCampoId(
      idCircuito,
      "circuito"
    );

    // 5. Si el ID es inválido, retornar error.
    if (validarIdCircuito.status === "error") {
      return retornarRespuestaFunciones(
        validarIdCircuito.status,
        validarIdCircuito.message
      );
    }

    // 6. Si todas las validaciones son correctas, retornar los datos consolidados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_circuito: validarIdCircuito.id,
    });
  } catch (error) {
    // 7. Manejo de errores inesperados.
    console.log("Error interno validar vocero id_circuito: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar vocero id_circuito"
    );
  }
}
