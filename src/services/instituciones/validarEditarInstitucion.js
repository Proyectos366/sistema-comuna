/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de edición de una institución en la base de datos.
 @module services/instituciones/validarEditar
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los campos y la identidad del usuario para la edición de una institución.
 @async
 @function validarEditarInstitucion
 @param {string} nombre - El nuevo nombre de la institución.
 @param {string} descripcion - La descripción de la institución.
 @param {string} rif - El RIF de la institución.
 @param {string} sector - El sector al que pertenece la institución.
 @param {string} direccion - La dirección física de la institución.
 @param {number} id_pais - El ID del país donde se ubica la institución.
 @param {number} id_estado - El ID del estado donde se ubica la institución.
 @param {number} id_municipio - El ID del municipio donde se ubica la institución.
 @param {number} id_institucion - El ID de la institución a editar.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEditarInstitucion(
  nombre,
  descripcion,
  rif,
  sector,
  direccion,
  id_pais,
  id_estado,
  id_municipio,
  id_parroquia,
  id_institucion
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
    const validandoCampos = ValidarCampos.validarCamposEditarInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia,
      id_institucion
    );

    // 4. Si los campos no son válidos, se retorna un error con el ID del usuario.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 5. Verificar si ya existe otra institución con el mismo nombre.
    const existente = await prisma.institucion.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_institucion,
        },
      },
    });

    // 6. Si el nombre ya está en uso por otra institución, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la institucion ya existe",
        { id_usuario: validaciones.id_usuario },
        400
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      rif: validandoCampos.rif,
      sector: validandoCampos.sector,
      direccion: validandoCampos.direccion,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
      id_municipio: validandoCampos.id_municipio,
      id_institucion: validandoCampos.id_institucion,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar editar institucion: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar institucion..."
    );
  }
}
