/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de cambiar el rol de otro usuario en el sistema.
 @module services/usuarios/validarCambiarRol
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los datos del usuario activo, los identificadores de rol y usuario objetivo,
 y verifica que el cambio de rol no sea redundante.
 @async
 @function validarCambiarRol
 @param {string|number} idRol - Identificador del nuevo rol que se desea asignar.
 @param {string|number} idUsuario - Identificador del usuario al que se le cambiará el rol.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCambiarRol(idRol, idUsuario) {
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

    // 4. Validar el ID del nuevo rol.
    const validarIdRol = ValidarCampos.validarCampoId(idRol, "rol");

    // 5. Validar el ID del usuario.
    const validarIdUsuario = ValidarCampos.validarCampoId(idUsuario, "usuario");

    // 6. Si el campo id_rol es inválido, retornar error.
    if (validarIdRol.status === "error") {
      return retornarRespuestaFunciones(
        validarIdRol.status,
        validarIdRol.message
      );
    }

    // 7. Si el campo id_rol es inválido, retornar error.
    if (validarIdUsuario.status === "error") {
      return retornarRespuestaFunciones(
        validarIdUsuario.status,
        validarIdUsuario.message
      );
    }

    // 8. Verificar si el usuario ya tiene asignado ese rol.
    const yaTieneRol = await prisma.usuario.findFirst({
      where: {
        id: validarIdUsuario.id,
        id_rol: validarIdRol.id,
        borrado: false,
      },
      select: { id: true },
    });

    // 9. Si yaTieneRol es true, retornar error.
    if (yaTieneRol) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el usuario ya tiene este rol... "
      );
    }

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_rol: validarIdRol.id,
      id_usuario_rol: validarIdUsuario.id,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar cambiar rol: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar cambiar rol"
    );
  }
}
