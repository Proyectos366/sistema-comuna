/**
 @fileoverview Función utilitaria para validar la identidad del usuario y un ID de circuito antes
 de consultar los consejos comunales. @module services/consejos/validarConsultarPorCircuito
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y el ID del circuito para consultar consejos comunales.
 @async
 @function validarConsultarConsejoIdCircuito
 @param {object} request - El objeto de solicitud HTTP que contiene los parámetros de la URL.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarConsejoIdCircuito(request) {
  try {
    // 1. Extraer el parámetro 'idCircuito' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idCircuito = searchParams.get("idCircuito");

    // 2. Obtener los datos del usuario activo a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Validar que el 'idCircuito' sea un ID válido.
    const id_circuito = ValidarCampos.validarCampoId(idCircuito, "circuito");

    // 5. Si la validación del ID del circuito falla, se retorna un error.
    if (id_circuito.status === "error") {
      return retornarRespuestaFunciones(
        id_circuito.status,
        id_circuito.message
      );
    }

    // 6. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_circuito: id_circuito.id,
    });
  } catch (err) {
    // 7. Manejo de errores inesperados.
    console.log(`Error interno validar consultar consejo id_circuito: ` + err);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar consejo id_circuito"
    );
  }
}
