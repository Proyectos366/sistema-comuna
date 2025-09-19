/**
 @fileoverview Función utilitaria para validar la identidad del usuario y sus permisos
 antes de realizar una consulta de todos los municipios disponibles en el sistema.
 @module services/municipios/validarConsultarTodosMunicipios
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y sus permisos para consultar todos los municipios registrados.
 Solo usuarios con rol master (rol 1) tienen acceso autorizado.
 @async
 @function validarConsultarTodosMunicipios
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarTodosMunicipios() {
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

    // 3. Verificar si el usuario tiene permisos de master (rol 1).
    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permiso..."
      );
    }

    // 4. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
    });
  } catch (error) {
    // 5. Manejo de errores inesperados.
    console.log("Error interno validar consultar todos municipios: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todos municipios"
    );
  }
}
