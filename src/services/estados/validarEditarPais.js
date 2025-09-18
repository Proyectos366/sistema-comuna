/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de editar un estado dentro de un país.
 @module services/estados/validarEditarEstado
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos específicos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario, sus permisos y los datos requeridos para editar un estado.
 Verifica que el nombre no esté duplicado dentro del mismo país.
 @async
 @function validarEditarEstado
 @param {string} nombre - Nombre del estado.
 @param {string} capital - Capital del estado.
 @param {string|number} codigoPostal - Código postal del estado.
 @param {string} descripcion - Descripción del estado.
 @param {string|number} id_pais - Identificador único del país al que pertenece el estado.
 @param {string|number} id_estado - Identificador único del estado a editar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEditarEstado(
  nombre,
  capital,
  codigoPostal,
  descripcion,
  id_pais,
  id_estado
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

    // 3. Verificar si el usuario tiene rol master (rol 1).
    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permiso",
        { id_usuario: validaciones.id_usuario }
      );
    }

    // 4. Validar los campos del estado.
    const validandoCampos = ValidarCampos.validarCamposEditarEstado(
      nombre,
      capital,
      codigoPostal,
      descripcion,
      id_pais,
      id_estado
    );

    // 5. Si los campos son inválidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    // 6. Verificar si ya existe otro estado con el mismo nombre en el mismo país.
    const existente = await prisma.estado.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_pais: validandoCampos.id_pais,
        id: {
          not: validandoCampos.id_estado, // excluye el pais que estás editando
        },
      },
    });

    // 7. Si el nombre ya está en uso, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones("error", "Error el estado ya existe", {
        id_usuario: validaciones.id_usuario,
      });
    }

    // 8. Si todas las validaciones son correctas, se retorna la información consolidada.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      capital: validandoCampos.capital,
      codigoPostal: validandoCampos.codigoPostal,
      descripcion: validandoCampos.descripcion,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log("Error interno validar editar estado: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar estado..."
    );
  }
}
