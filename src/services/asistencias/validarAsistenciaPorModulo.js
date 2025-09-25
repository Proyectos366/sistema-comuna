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
  nombreFormador,
  descripcion
) {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si la validación falla, retorna una respuesta de error
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Validar los campos de entrada.
    const idAsistencia = ValidarCampos.validarCampoId(id_asistencia);
    const moduloNumero = ValidarCampos.validarCampoId(modulo);
    const validarNombre = ValidarCampos.validarCampoNombre(nombreFormador);
    const validarFecha = ValidarCampos.validarCampoFechaISO(fecha);
    const validarDescr = ValidarCampos.validarCampoTexto(descripcion);

    // 4. Verificar si el idAsistencia es invalido se retorna un error.
    if (idAsistencia.status === "error") {
      return retornarRespuestaFunciones(
        idAsistencia.status,
        idAsistencia.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 5. Si el modulo es invalido se retorna un error.
    if (moduloNumero.status === "error") {
      return retornarRespuestaFunciones(
        moduloNumero.status,
        moduloNumero.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 6. Si el nombre del formador es invalido se retorna un error.
    if (validarNombre.status === "error") {
      return retornarRespuestaFunciones(
        validarNombre.status,
        validarNombre.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 7. Si la fecha es invalida se retorna un error.
    if (validarFecha.status === "error") {
      return retornarRespuestaFunciones(
        validarFecha.status,
        validarFecha.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 8. Consolidar datos validados y retornar respuesta exitosa
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      modulo: moduloNumero.id,
      id_asistencia: idAsistencia.id,
      nombreFormador: validarNombre.nombre,
      fecha: validarFecha.fecha,
      descripcion: validarDescr.texto,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log(`Error, interno al validar asistencia: ` + error);

    // Retorna una respuesta del error inesperado.
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al validar asistencia"
    );
  }
}
