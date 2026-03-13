/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de un estante en la base de datos.
 @module services/estantes/validarCrearEstante
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para crear un nuevo estante.
 @async
 @function validarCrearEstante
 @param {string} nombre - El nombre del nuevo estante.
 @param {string} descripcion - La descripción del nuevo estante.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCrearEstante(
  nombre,
  descripcion,
  alias,
  niveles,
  secciones,
  cabecera,
) {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validarCampos = ValidarCampos.validarCamposCrearEstante(
      nombre,
      descripcion,
      alias,
      niveles,
      secciones,
      cabecera,
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
      );
    }

    // 5. Verificar si el nombre del estante ya existe en la base de datos.
    const nombreRepetido = await prisma.estante.findFirst({
      where: {
        id_institucion: validaciones.id_institucion,
        id_departamento: validaciones.id_departamento,
        nombre: validarCampos.nombre,
        alias: validarCampos.alias,
      },
    });

    // 6. Si se encuentra un estante con el mismo nombre, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, estante ya existe", {
        id_usuario: validaciones.id_usuario,
        codigo: 409,
      });
    }

    // crear codigo del departamento
    const cantidadEstantes = await prisma.estante.count({
      where: {
        id_departamento: validaciones.id_departamento,
      },
    });

    const numeroCodigo = String(
      cantidadEstantes ? cantidadEstantes + 1 : cantidadEstantes,
    ).padStart(4, "0");
    const codigoNuevo =
      validaciones.codDepa.toUpperCase() + "-EST-" + numeroCodigo;

    // Verificar si el departamento ya existe
    const estanteExistente = await prisma.estante.findFirst({
      where: {
        OR: [
          { codigo: codigoNuevo },
          { nombre: validarCampos.nombre },
          { alias: validarCampos.alias },
        ],
        id_institucion: validaciones.id_institucion,
      },
    });

    // 6. Si se encuentra un estante con el mismo nombre, se retorna un error.
    if (estanteExistente) {
      return retornarRespuestaFunciones("error", "Error, estante ya existe", {
        id_usuario: validaciones.id_usuario,
        codigo: 409,
      });
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos para la creación.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      alias: validarCampos.alias,
      niveles: validarCampos.niveles,
      secciones: validarCampos.secciones,
      cabecera: validarCampos.cabecera,
      codigo: codigoNuevo,
      nombreInstitucion: validaciones.nombreInstitucion,
      nombreDepartamento: validaciones.nombreDepartamento,
      id_institucion: validaciones.id_institucion,
      id_departamento: validaciones.id_departamento,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log(`Error interno validar crear estante: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear estante",
    );
  }
}
