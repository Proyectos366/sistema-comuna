/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de editar un país existente en el sistema.
 @module services/paises/validarEditarPais
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos específicos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario, sus permisos y los datos requeridos para editar un país.
 Verifica que el nombre no esté duplicado y que los campos sean válidos.
 @async
 @function validarEditarPais
 @param {string} nombre - Nombre del país.
 @param {string} capital - Capital del país.
 @param {string} descripcion - Descripción del país.
 @param {string|number} id_pais - Identificador único del país a editar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEditarPais(
  nombre,
  capital,
  descripcion,
  id_pais
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
        "Error, usuario no tiene permiso",
        { id_usuario: validaciones.id_usuario }
      );
    }

    // 4. Validar los campos del país.
    const validandoCampos = ValidarCampos.validarCamposEditarPais(
      nombre,
      capital,
      descripcion,
      id_pais
    );

    // 5. Si los campos son inválidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 6. Verificar si ya existe otro país con el mismo nombre (excluyendo el actual).
    const existente = await prisma.pais.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_pais,
        },
      },
    });

    // 7. Si el nombre ya está en uso, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones("error", "Error, el pais ya existe", {
        id_usuario: validaciones.id_usuario,
      });
    }

    // 8. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      capital: validandoCampos.capital,
      descripcion: validandoCampos.descripcion,
      id_pais: validandoCampos.id_pais,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log("Error interno validar editar pais: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar pais..."
    );
  }
}
