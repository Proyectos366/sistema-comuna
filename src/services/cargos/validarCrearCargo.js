/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de cargo en la base de datos. @module services/cargos/validarCrear
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para crear un nuevo cargo.
 @async
 @function validarCrearCargo
 @param {string} nombre - El nombre del nuevo cargo.
 @param {string} descripcion - La descripción del nuevo cargo.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCrearCargo(nombre, descripcion) {
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
    const validarCampos = ValidarCampos.validarCamposCrearCargo(
      nombre,
      descripcion
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    // 5. Verificar si el nombre del cargo ya existe en la base de datos.
    const nombreRepetido = await prisma.cargo.findFirst({
      where: {
        nombre: validarCampos.nombre,
      },
    });

    // 6. Si se encuentra un cargo con el mismo nombre, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, cargo ya existe...", {
        id_usuario: validaciones.id_usuario,
      });
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos para la creación.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log(`Error interno validar crear cargo: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear cargo"
    );
  }
}
