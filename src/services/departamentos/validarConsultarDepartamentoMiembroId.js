/**
 @fileoverview Función utilitaria para validar la identidad del usuario y sus permisos
 antes de consultar el departamento asociado al miembro por su ID.
 @module services/departamentos/validarConsultarDepartamentoMiembroId
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y sus permisos para consultar el departamento asociado al miembro.
 Solo usuarios asignados a un departamento tienen acceso.
 @async
 @function validarConsultarDepartamentoMiembroId
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarDepartamentoMiembroId() {
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

    // 3. Verificar si el usuario pertenece a un departamento.
    if (!validaciones.id_departamento) {
      return retornarRespuestaFunciones(
        "error",
        "Error, sin departamento asignado..."
      );
    }

    // 4. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_departamento: validaciones.id_departamento,
    });
  } catch (err) {
    // 5. Manejo de errores inesperados.
    console.log("Error interno validar consultar departamento miembro: " + err);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar departamento miembro"
    );
  }
}
