/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de circuito en la base de datos. @module services/circuitos/validarCrearCircuito
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para crear un nuevo circuito.
 @async
 @function validarCrearCircuito
 @param {string} nombre - El nombre del nuevo circuito.
 @param {string} direccion - La dirección del circuito.
 @param {string} norte - La delimitación norte del circuito.
 @param {string} sur - La delimitación sur del circuito.
 @param {string} este - La delimitación este del circuito.
 @param {string} oeste - La delimitación oeste del circuito.
 @param {string} punto - El punto de referencia principal del circuito.
 @param {string} codigo - El código del circuito.
 @param {number} id_parroquia - El ID del parroquia a la que pertenece la circuito.
 @returns {Promise<Response>} Respuesta estructurada con el resultado del validación.
*/

export default async function validarCrearCircuito(
  nombre,
  direccion,
  norte,
  sur,
  este,
  oeste,
  punto,
  codigo,
  id_parroquia
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

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validandoCampos = ValidarCampos.validarCamposCrearCircuito(
      nombre,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
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

    // 5. Verificar si ya existe una circuito con el mismo nombre y parroquia.
    const nombreRepetido = await prisma.circuito.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_parroquia: validandoCampos.id_parroquia,
      },
    });

    // 6. Si se encuentra una circuito con los mismos datos, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, circuito ya existe..."
      );
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
      codigo: validandoCampos.codigo,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log(`Error interno validar crear circuito: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear circuito"
    );
  }
}
