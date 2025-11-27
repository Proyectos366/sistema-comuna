/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los parámetros necesarios
 antes de crear un nuevo departamento en una institución.
 @module services/departamentos/validarCrearDepartamento
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y los datos requeridos para crear un nuevo departamento.
 Verifica que el nombre no esté repetido dentro de la misma institución.
 @async
 @function validarCrearDepartamento
 @param {string} nombre - Nombre del departamento a crear.
 @param {string} descripcion - Descripción del departamento.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearDepartamento(
  nombre,
  descripcion,
  id_institucion
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

    // 3. Validar los campos nombre y descripción del departamento.
    const validarCampos = ValidarCampos.validarCamposCrearDepartamento(
      nombre,
      descripcion,
      id_institucion
    );

    // 4. Si los campos son inválidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    // 5. Verificar si ya existe un departamento con el mismo nombre en la misma institución.
    const nombreRepetido = await prisma.departamento.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_institucion: validarCampos.id_institucion,
      },
    });

    // 6. Si el nombre ya está en uso, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, departamento ya existe...",
        {
          id_usuario: validarCampos.id_usuario,
        }
      );
    }

    // 7. Si todas las validaciones son correctas, se retorna la información consolidada.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      id_institucion: validarCampos.id_institucion,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar crear departamento: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear departamento"
    );
  }
}
