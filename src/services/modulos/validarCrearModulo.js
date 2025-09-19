/**
 @fileoverview Función utilitaria para validar la identidad del usuario y el nombre
 antes de crear un nuevo módulo de formación.
 @module services/modulos/validarCrearModulo
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales

/**
 Valida la identidad del usuario y el nombre del módulo antes de permitir su creación.
 @async
 @function validarCrearModulo
 @param {string} nombre - Nombre del módulo a crear.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearModulo(nombre) {
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

    // 3. Validar el campo nombre del módulo.
    const validarNombre = await ValidarCampos.validarCampoNombre(nombre);

    // 4. Si el nombre es inválido, se retorna un error.
    if (validarNombre.status === "error") {
      return retornarRespuestaFunciones(
        validarNombre.status,
        validarNombre.message,
        { id_usuario: validaciones.id_usuario }
      );
    }

    // 5. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarNombre.nombre,
    });
  } catch (error) {
    // 6. Manejo de errores inesperados.
    console.log("Error interno validar crear modulo: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear modulo"
    );
  }
}
