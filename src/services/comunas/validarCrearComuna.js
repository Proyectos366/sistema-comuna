/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de comuna en la base de datos. @module services/comunas/validarCrear
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para crear una nueva comuna.
 @async
 @function validarCrearComuna
 @param {string} nombre - El nombre de la nueva comuna.
 @param {string} direccion - La dirección de la comuna.
 @param {string} norte - La delimitación norte de la comuna.
 @param {string} sur - La delimitación sur de la comuna.
 @param {string} este - La delimitación este de la comuna.
 @param {string} oeste - La delimitación oeste de la comuna.
 @param {string} punto - El punto de referencia principal de la comuna.
 @param {string} rif - El RIF de la comuna.
 @param {string} codigo - El código de la comuna.
 @param {number} id_parroquia - El ID de la parroquia a la que pertenece la comuna.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCrearComuna(
  nombre,
  direccion,
  norte,
  sur,
  este,
  oeste,
  punto,
  rif,
  codigo,
  id_parroquia
) {
  try {
    // 1. Obtener y validar el correo del usuario a través del token.
    const validaciones = obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validandoCampos = ValidarCampos.validarCamposCrearComuna(
      nombre,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
      rif,
      codigo,
      id_parroquia
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    // 5. Verificar si ya existe una comuna con el mismo nombre y parroquia.
    const nombreRepetido = await prisma.comuna.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_parroquia: validandoCampos.id_parroquia,
      },
    });

    // 6. Si se encuentra una comuna con los mismos datos, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, comuna ya existe...");
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_parroquia: validandoCampos.id_parroquia,
      nombre: validandoCampos.nombre,
      direccion: validandoCampos.direccion,
      norte: validandoCampos.norte,
      sur: validandoCampos.sur,
      este: validandoCampos.este,
      oeste: validandoCampos.oeste,
      punto: validandoCampos.punto,
      rif: validandoCampos.rif,
      codigo: validandoCampos.codigo,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log(`Error interno validar crear comuna: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear comuna"
    );
  }
}
