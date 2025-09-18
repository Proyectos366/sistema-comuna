/**
 @fileoverview Función utilitaria para validar la identidad del usuario y un ID de parroquia antes
 de consultar todas las comunas relacionadas. @module services/comunas/validarConsultarComunas
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida la identidad del usuario y el ID de la parroquia para consultar comunas.
 @async
 @function validarConsultarComunasIdParroquia
 @param {object} request - El objeto de solicitud HTTP que contiene la URL.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarComunasIdParroquia(request) {
  try {
    // 1. Obtener el parámetro 'idParroquia' de la URL de la solicitud.
    const { searchParams } = new URL(request.url);
    const idParroquia = searchParams.get("idParroquia");

    // 2. Obtener y validar el correo del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 3. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Validar que el 'idParroquia' sea un ID válido.
    const id_parroquia = ValidarCampos.validarCampoId(idParroquia, "parroquia");

    // 5. Si la validación del ID de la parroquia falla, se retorna un error.
    if (id_parroquia.status === "error") {
      return retornarRespuestaFunciones(
        id_parroquia.status,
        id_parroquia.message
      );
    }

    // 8. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_parroquia: id_parroquia.id,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log(
      `Error interno validar consultar comuna id_parroquia: ` + error
    );

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar comuna id_parroquia"
    );
  }
}
