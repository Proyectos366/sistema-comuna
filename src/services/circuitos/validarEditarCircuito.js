/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de edición de un circuito en la base de datos. @module services/circuitos/validarEditarCircuito
*/

import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la identidad del usuario para la edición de un circuito.
 @async
 @function validarEditarCircuito
 @param {string} nombre - El nuevo nombre del circuito.
 @param {number} id_parroquia - El ID de la parroquia a la que pertenece el circuito.
 @param {number} id_circuito - El ID del circuito a editar.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarEditarCircuito(
  nombre,
  id_parroquia,
  id_circuito
) {
  try {
    // 1. Obtener y validar el correo del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 4. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validandoCampos = ValidarCampos.validarCamposEditarCircuito(
      nombre,
      id_parroquia,
      id_circuito
    );

    // 5. Si los campos no son válidos, se retorna un error con el ID del usuario.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 6. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      id_usuario: validaciones.id_usuario,
      id_parroquia: validandoCampos.id_parroquia,
      id_circuito: validandoCampos.id_circuito,
    });
  } catch (error) {
    // 7. Manejo de errores inesperados.
    console.log(`Error interno validar editar circuito: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar circuito..."
    );
  }
}
