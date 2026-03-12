/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de edición de cargo en la base de datos. @module services/cargos/validarEditar
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para editar un cargo.
 @async
 @function validarEditarCargo
 @param {string} nombre - El nuevo nombre del cargo.
 @param {string} descripcion - La nueva descripción del cargo.
 @param {number} id_cargo - El ID del cargo a editar.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarEditarCargo(
  nombre,
  descripcion,
  id_cargo
) {
  try {
    // 1. Obtener y validar el correo del usuario desde el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validandoCampos = ValidarCampos.validarCamposEditarCargo(
      nombre,
      descripcion,
      id_cargo
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

    // 5. Verificar si ya existe otro cargo con el mismo nombre.
    const existente = await prisma.cargo.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_cargo, // excluye el cargo que estás editando
        },
      },
    });

    // 6. Si se encuentra un cargo con el mismo nombre, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el cargo ya existe",
        { id_usuario: validaciones.id_usuario },
        400
      );
    }

    // 8. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_cargo: validandoCampos.id_cargo,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log(`Error, interno al editar cargo: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar cargo..."
    );
  }
}
