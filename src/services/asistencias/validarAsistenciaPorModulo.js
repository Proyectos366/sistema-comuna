/**
 @fileoverview Este archivo contiene la función para validar y procesar la asistencia de un usuario
 a un módulo de formación, realizando autenticación, validación de datos y manejo de errores.
 @module api/asistencias/validarAsistenciaPorModulo
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar los campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos necesarios y la identidad del usuario para registrar una asistencia por módulo.
 @function validarAsistenciaPorModulo
 @param {number} modulo - El número del módulo de formación.
 @param {string} fecha - La fecha de la asistencia.
 @param {number} id_asistencia - El ID del registro de asistencia.
 @param {string} nombreFormador - El nombre del formador que registra la asistencia.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarAsistenciaPorModulo(
  modulo,
  fecha,
  id_asistencia,
  id_formador,
  descripcion,
) {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si la validación falla, retorna una respuesta de error
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validarCampos = ValidarCampos.validarCamposAsistenciaModulo(
      modulo,
      fecha,
      id_asistencia,
      id_formador,
      descripcion,
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
      );
    }

    // 8. Consolidar datos validados y retornar respuesta exitosa
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      modulo: validarCampos.modulo,
      fecha: validarCampos.fecha,
      id_asistencia: validarCampos.id_asistencia,
      id_formador: validarCampos.id_formador,
      descripcion: validarCampos.descripcion,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log(`Error, interno al validar asistencia modulo: ` + error);

    // Retorna una respuesta del error inesperado.
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al validar asistencia modulo",
    );
  }
}
