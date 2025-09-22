/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de asignar a otro usuario a un departamento.
 @module services/departamentos/validarAsignarAlDepartamento
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los datos del usuario activo, los identificadores del departamento y del usuario objetivo,
 y verifica que el usuario aún no pertenezca al departamento antes de realizar la asignación.
 @async
 @function validarAsignarAlDepartamento
 @param {string|number} idDepartamento - Identificador del departamento al que se desea asignar al usuario.
 @param {string|number} idUsuario - Identificador del usuario que será asignado al departamento.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarAsignarAlDepartamento(
  idDepartamento,
  idUsuario
) {
  try {
    // 1. Validar identidad del usuario activo mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Verificar si el usuario tiene permisos (rol 1 = master, rol 2 = administrador).
    if (validaciones.id_rol !== 1 && validaciones.id_rol !== 2) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    // 4. Validar el ID del departamento destino.
    const validarIdDepartamento = ValidarCampos.validarCampoId(
      idDepartamento,
      "departamento"
    );

    // 5. Validar el ID del usuario que será asignado.
    const validarIdUsuario = ValidarCampos.validarCampoId(idUsuario, "usuario");

    // 6. Si el ID del departamento es inválido, retornar error.
    if (validarIdDepartamento.status === "error") {
      return retornarRespuestaFunciones(
        validarIdDepartamento.status,
        validarIdDepartamento.message
      );
    }

    // 7. Si el ID del usuario es inválido, retornar error.
    if (validarIdUsuario.status === "error") {
      return retornarRespuestaFunciones(
        validarIdUsuario.status,
        validarIdUsuario.message
      );
    }

    // 8. Verificar si el usuario ya pertenece al departamento indicado.
    const yaEsMiembro = await prisma.departamento.findFirst({
      where: {
        id: validarIdDepartamento.id,
        miembros: {
          some: { id: validarIdUsuario.id },
        },
      },
    });

    // 9. Si el usuario ya está en el departamento, retornar error.
    if (yaEsMiembro) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el usuario ya esta en este departamento... "
      );
    }

    // 10. Si todas las validaciones son correctas, retornar los datos consolidados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_departamento: validarIdDepartamento.id,
      id_usuario_miembro: validarIdUsuario.id,
    });
  } catch (error) {
    // 11. Manejo de errores inesperados.
    console.log("Error interno validar asignar departamento: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar asignar departamento"
    );
  }
}
