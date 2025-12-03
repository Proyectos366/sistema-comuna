/**
 @fileoverview Función utilitaria para validar la identidad del usuario y sus permisos
 antes de realizar una consulta de todas las parroquias disponibles en el sistema.
 @module services/parroquias/validarConsultarTodasParroquias
*/
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación
/**
 Valida la identidad del usuario y sus permisos para consultar todas las parroquias registradas.
 Solo usuarios con rol master (rol 1) tienen acceso autorizado.
 @async
 @function validarConsultarTodasParroquias
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarTodasParroquias() {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_municipio: validaciones.id_municipio,
      id_rol: validaciones.id_rol
    });
  } catch (error) {
    // 4. Manejo de errores inesperados.
    console.log("Error interno validar consultar todas parroquias: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todas parroquias"
    );
  }
}
