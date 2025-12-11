/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de un consejo comunal en la base de datos. @module services/consejos/validarCrear
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para crear un nuevo consejo comunal.
 @async
 @function validarCrearConsejoComunal
 @param {string} nombre - El nombre del nuevo consejo comunal.
 @param {string} direccion - La dirección del consejo comunal.
 @param {string} norte - La delimitación norte del consejo.
 @param {string} sur - La delimitación sur del consejo.
 @param {string} este - La delimitación este del consejo.
 @param {string} oeste - La delimitación oeste del consejo.
 @param {string} punto - El punto de referencia principal.
 @param {string} rif - El RIF del consejo.
 @param {string} codigo - El código del consejo.
 @param {number} id_parroquia - El ID de la parroquia a la que pertenece.
 @param {number} id_comuna - El ID de la comuna a la que pertenece (opcional).
 @param {number} id_circuito - El ID del circuito al que pertenece (opcional).
 @param {string} comunaCircuito - Indica si pertenece a una comuna o a un circuito.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearConsejoComunal(
  nombre,
  descripcion,
  direccion,
  norte,
  sur,
  este,
  oeste,
  punto,
  rif,
  codigo,
  id_parroquia,
  id_comuna,
  id_circuito
) {
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

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validandoCampos = ValidarCampos.validarCamposCrearConsejoComunal(
      nombre,
      descripcion,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
      rif,
      codigo,
      id_parroquia,
      id_comuna,
      id_circuito
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    // 6. Definir la cláusula de búsqueda para verificar si el consejo ya existe.
    const whereClause = {
      nombre: validandoCampos.nombre,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
      id_circuito: validandoCampos.id_circuito,
    };

    // 7. Buscar un consejo existente con los mismos datos.
    const consejoExistente = await prisma.consejo.findFirst({
      where: whereClause,
    });

    // 8. Si se encuentra un consejo con los mismos datos, se retorna un error.
    if (consejoExistente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, consejo comunal ya existe...."
      );
    }

    // 9. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
      id_circuito: validandoCampos.id_circuito,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
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
    // 10. Manejo de errores inesperados.
    console.log(`Error interno validar crear consejo: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear consejo"
    );
  }
}
