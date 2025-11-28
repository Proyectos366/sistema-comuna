/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los parámetros necesarios
 antes de editar un departamento existente. @module services/departamentos/validarEditarDepartamento
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos específicos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y los datos necesarios para editar un departamento. Verifica que
 el nombre no esté duplicado y que los campos sean válidos.
 @async
 @function validarEditarDepartamento
 @param {string} nombre - Nombre del departamento a editar.
 @param {string} descripcion - Descripción del departamento.
 @param {string|number} id_departamento - Identificador único del departamento a editar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEditarDepartamento(
  nombre,
  descripcion,
  id_institucion,
  id_departamento
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

    // 3. Validar los campos del departamento (nombre, descripción, id).
    const validandoCampos = ValidarCampos.validarCamposEditarDepartamento(
      nombre,
      descripcion,
      id_institucion,
      id_departamento
    );

    // 4. Si alguno de los campos es inválido, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 5. Verificar si ya existe otro departamento con el mismo nombre (excluyendo el actual).
    const existente = await prisma.departamento.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_institucion: validandoCampos.id_institucion,
        id: {
          not: validandoCampos.id_departamento,
        },
      },
    });

    // 6. Si el nombre ya está en uso por otro departamento, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el departamento ya existe",
        { id_usuario: validaciones.id_usuario },
        400
      );
    }

    // 7. Si todas las validaciones son correctas, se retorna la información consolidada.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_usuario: validaciones.id_usuario,
      id_institucion: validandoCampos.id_institucion,
      id_departamento: validandoCampos.id_departamento,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar editar departamento: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar departamento..."
    );
  }
}
