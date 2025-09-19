/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de editar una parroquia dentro de un municipio.
 @module services/parroquias/validarEditarParroquia
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos específicos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario, sus permisos y los datos requeridos para editar una parroquia.
 Verifica que el nombre no esté duplicado dentro del mismo municipio.
 @async
 @function validarEditarParroquia
 @param {string} nombre - Nombre de la parroquia.
 @param {string} descripcion - Descripción de la parroquia.
 @param {string|number} id_pais - Identificador del país.
 @param {string|number} id_estado - Identificador del estado.
 @param {string|number} id_municipio - Identificador del municipio.
 @param {string|number} id_parroquia - Identificador de la parroquia a editar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarEditarParroquia(
  nombre,
  descripcion,
  id_pais,
  id_estado,
  id_municipio,
  id_parroquia
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
        { id_usuario: datosUsuario.id }
      );
    }

    // 4. Validar los campos del municipio.
    const validandoCampos = ValidarCampos.validarCamposEditarParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia
    );

    // 5. Si los campos son inválidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    // 6. Verificar si ya existe otra parroquia con el mismo nombre en el mismo municipio.
    const existente = await prisma.parroquia.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_municipio: validandoCampos.id_municipio,
        id: {
          not: validandoCampos.id_parroquia,
        },
      },
    });

    // 7. Si el nombre ya está en uso, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la parroquia ya existe",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 8. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
      id_municipio: validandoCampos.id_municipio,
      id_parroquia: validandoCampos.id_parroquia,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log("Error interno validar editar parroquia: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar editar parroquia..."
    );
  }
}
