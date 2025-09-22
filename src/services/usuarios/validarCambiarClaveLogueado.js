/**
 @fileoverview Función utilitaria para validar la identidad del usuario logueado,
 verificar su contraseña actual y procesar el cambio por una nueva clave segura.
 @module services/usuarios/validarCambiarClaveLogueado
*/

import ValidarCampos from "@/services/ValidarCampos"; // Utilidad para validar campos individuales
import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves"; // Utilidad para cifrar y comparar contraseñas
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario logueado, verifica que la contraseña actual sea correcta
 y genera una nueva clave cifrada si la validación es exitosa.
 @async
 @function validarCambiarClaveLogueado
 @param {string} claveVieja - Contraseña actual del usuario.
 @param {string} claveUno - Nueva contraseña ingresada.
 @param {string} claveDos - Confirmación de la nueva contraseña.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCambiarClaveLogueado(
  claveVieja,
  claveUno,
  claveDos
) {
  try {
    // 1. Validar identidad del usuario mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Obtener la clave actual del usuario desde la base de datos.
    const claveUsuarioActivo = await prisma.usuario.findFirst({
      where: { correo: validaciones.correo },
      select: {
        clave: true,
        id: true,
      },
    });

    // 4. Si el usuario no existe, retornar error.
    if (!claveUsuarioActivo) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...", {
        id_usuario: validaciones.id_usuario,
      });
    }

    // 5. Validar que las nuevas claves coincidan y cumplan con los requisitos.
    const validandoCampos = ValidarCampos.validarCampoClave(claveUno, claveDos);

    // 6. Si los campos son inválido, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 7. Comparar la clave actual ingresada con la almacenada.
    const comparada = await CifrarDescifrarClaves.compararClave(
      claveVieja,
      claveUsuarioActivo.clave
    );

    // 8. Si las claves comparadas es false, se retorna un error.
    if (comparada.status === "error") {
      return retornarRespuestaFunciones(comparada.status, comparada.message, {
        id_usuario: validaciones.id_usuario,
      });
    }

    // 9. Cifrar la nueva clave.
    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    // 10. Si la clave encriptada es inválida, se retorna un error.
    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 11. Si todas las validaciones son correctas, retornar la nueva clave cifrada.
    return retornarRespuestaFunciones("ok", "Validacion completa", {
      claveEncriptada: claveEncriptada.claveEncriptada,
      id_usuario: validaciones.id_usuario,
    });
  } catch (error) {
    // 12. Manejo de errores inesperados.
    console.error("Error interno validar cambiar clave loggeado: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar cambiar clave loggeado"
    );
  }
}
