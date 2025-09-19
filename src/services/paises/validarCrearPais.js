/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de crear un nuevo país en el sistema.
 @module services/paises/validarCrearPais
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario, sus permisos y los datos requeridos para crear un nuevo país.
 Verifica que el nombre no esté duplicado y que los campos sean válidos.
 @async
 @function validarCrearPais
 @param {string} nombre - Nombre del país.
 @param {string} capital - Capital del país.
 @param {string} descripcion - Descripción del país.
 @param {string} serial - Código serial único del país.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearPais(
  nombre,
  capital,
  descripcion,
  serial
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

    // 3. Verificar si el usuario tiene permisos de master (rol 1).
    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 4. Validar los campos del país.
    const validarCampos = ValidarCampos.validarCamposCrearPais(
      nombre,
      capital,
      descripcion,
      serial
    );

    // 5. Si los campos son inválidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    // 6. Verificar si ya existe un país con el mismo nombre.
    const nombreRepetido = await prisma.pais.findFirst({
      where: {
        nombre: validarCampos.nombre,
      },
    });

    // 7. Si el nombre ya está en uso, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, pais ya existe...", {
        id_usuario: validaciones.id_usuario,
      });
    }

    // 8. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      capital: validarCampos.capital,
      descripcion: validarCampos.descripcion,
      serial: validarCampos.serial,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log("Error interno validar crear pais: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear pais"
    );
  }
}
