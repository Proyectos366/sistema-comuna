/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de editar un municipio dentro de un estado.
 @module services/municipios/validarEditarMunicipio
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos específicos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario, sus permisos y los datos requeridos para editar un municipio.
 Verifica que el nombre no esté duplicado dentro del mismo estado.
 @async
 @function validarEditarMunicipio
 @param {string} nombre - Nombre del municipio.
 @param {string} descripcion - Descripción del municipio.
 @param {string|number} id_pais - Identificador del país.
 @param {string|number} id_estado - Identificador del estado.
 @param {string|number} id_municipio - Identificador del municipio a editar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEditarMunicipio(
  nombre,
  descripcion,
  id_pais,
  id_estado,
  id_municipio
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

    // 4. Validar los campos del municipio.
    const validandoCampos = ValidarCampos.validarCamposEditarMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio
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

    // 6. Verificar si ya existe otro municipio con el mismo nombre en el mismo estado.
    const existente = await prisma.municipio.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_estado: validandoCampos.id_estado,
        id: {
          not: validandoCampos.id_municipio,
        },
      },
    });

    // 7. Si el nombre ya está en uso, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el municipio ya existe",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 8. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
      id_municipio: validandoCampos.id_municipio,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log("Error interno validar editar municipio: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar municipio..."
    );
  }
}
