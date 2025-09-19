/**
 @fileoverview Función utilitaria para validar la identidad del usuario y sus permisos
 antes de consultar la institución asociada al miembro por su ID.
 @module services/instituciones/validarConsultarInstitucionMiembroId
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y sus permisos para consultar la institución asociada al miembro.
 Solo usuarios con rol 1 (administrador) o rol 2 (gestor) tienen acceso.
 @async
 @function validarConsultarInstitucionMiembroId
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarInstitucionMiembroId() {
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

    // 3. Verificar si el usuario tiene permisos (rol 1 o rol 2).
    if (validaciones.id_rol !== 1 && validaciones.id_rol !== 2) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    // 4. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_institucion: validaciones.id_institucion,
      id_municipio: validaciones.id_municipio,
    });
  } catch (err) {
    // 5. Manejo de errores inesperados.
    console.log("Error interno validar consultar institucion miembro: " + err);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar institucion miembro"
    );
  }
}
