/**
 @fileoverview Función utilitaria para validar la identidad del usuario y un ID de comuna antes
 de consultar los consejos comunales. @module services/consejos/validarConsultarPorComuna
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y el ID de la comuna para consultar consejos comunales.
 @async
 @function validarConsultarConsejoIdComuna
 @param {object} request - El objeto de solicitud HTTP que contiene los parámetros de la URL.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarConsejoIdComuna(request) {
  try {
    // 1. Extraer el parámetro 'idComuna' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idComuna = searchParams.get("idComuna");

    // 2. Obtener los datos del usuario activo a través del token.
    const validaciones = obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Validar que el 'idComuna' sea un ID válido.
    const id_comuna = ValidarCampos.validarCampoId(idComuna, "comuna");

    // 5. Si la validación del ID de la comuna falla, se retorna un error.
    if (id_comuna.status === "error") {
      return retornarRespuestaFunciones(id_comuna.status, id_comuna.message);
    }

    // 6. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_comuna: id_comuna.id,
    });
  } catch (error) {
    // 7. Manejo de errores inesperados.
    console.log(`Error interno validar consultar consejo id_comuna: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar consultar consejo id_comuna"
    );
  }
}
