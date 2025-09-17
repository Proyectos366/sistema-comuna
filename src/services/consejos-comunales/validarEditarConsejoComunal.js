/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de edición de un consejo comunal en la base de datos. @module services/consejos/validarEditar
*/

import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los campos y la identidad del usuario para la edición de un consejo comunal.
 @async
 @function validarEditarConsejoComunal
 @param {string} nombre - El nuevo nombre del consejo comunal.
 @param {number} id_comuna - El ID de la comuna a la que pertenece el consejo.
 @param {number} id_consejo - El ID del consejo comunal a editar.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarEditarConsejoComunal(
  nombre,
  id_comuna,
  id_consejo
) {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validandoCampos = ValidarCampos.validarCamposEditarConsejo(
      nombre,
      id_comuna,
      id_consejo
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 5. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      id_comuna: validandoCampos.id_comuna,
      id_consejo: validandoCampos.id_consejo,
    });
  } catch (error) {
    // 6. Manejo de errores inesperados.
    console.log(`Error, interno al editar consejo comunal: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar consejo comunal..."
    );
  }
}
