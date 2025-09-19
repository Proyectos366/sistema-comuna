/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los parámetros
 necesarios antes de editar una novedad existente en el sistema.
 @module services/novedades/validarEditarNovedad
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos específicos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y los datos requeridos para editar una novedad.
 Verifica que no exista otra novedad con el mismo nombre.
 @async
 @function validarEditarNovedad
 @param {string} nombre - Nombre de la novedad.
 @param {string} descripcion - Descripción de la novedad.
 @param {string|number} id_novedad - Identificador único de la novedad a editar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEditarNovedad(
  nombre,
  descripcion,
  id_novedad
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

    // 3. Validar los campos de la novedad.
    const validandoCampos = ValidarCampos.validarCamposEditarNovedad(
      nombre,
      descripcion,
      id_novedad
    );

    // 4. Si los campos son inválidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 5. Verificar si ya existe otra novedad con el mismo nombre.
    const existente = await prisma.novedad.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_novedad,
        },
      },
    });

    // 6. Si el nombre ya está en uso, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la novedad ya existe",
        { id_usuario: validaciones.id_usuario },
        400
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_novedad: validandoCampos.id_novedad,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar editar novedad: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar novedad..."
    );
  }
}
