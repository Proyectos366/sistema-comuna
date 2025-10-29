/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de registrar un nuevo usuario en el sistema.
 @module services/usuarios/validarCrearUsuario
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import AuthTokens from "@/libs/AuthTokens"; // Utilidad para generar tokens de autenticación
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves"; // Utilidad para cifrar contraseñas
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los datos del usuario activo, los campos del nuevo usuario y las condiciones de registro.
 Verifica duplicidad, genera token, cifra la contraseña y determina la institución asociada.
 @async
 @function validarCrearUsuario
 @param {string|number} cedula - Cédula del nuevo usuario.
 @param {string} nombre - Nombre del nuevo usuario.
 @param {string} apellido - Apellido del nuevo usuario.
 @param {string} correo - Correo electrónico del nuevo usuario.
 @param {string} claveUno - Contraseña ingresada.
 @param {string} claveDos - Confirmación de contraseña.
 @param {number} id_rol - Rol asignado al nuevo usuario.
 @param {boolean} autorizar - Indica si el usuario está autorizado.
 @param {Array<{id: number}>} instituciones - Lista de instituciones (solo para administradores).
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCrearUsuario(
  cedula,
  nombre,
  apellido,
  correo,
  claveUno,
  claveDos,
  id_rol,
  autorizar,
  instituciones
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

    // 3. Validar los campos del nuevo usuario.
    const validandoCampos = ValidarCampos.validarCamposRegistro(
      cedula,
      nombre,
      apellido,
      correo,
      claveUno,
      claveDos,
      id_rol,
      autorizar
    );

    // 4. Si los campos son inválidos, retornar error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    // 5. Generar token de autenticación para el nuevo usuario.
    const tokenAuth = AuthTokens.tokenValidarUsuario(10);

    // 6. Verificar si ya existe un usuario con el mismo correo, cédula o token.
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { correo: validandoCampos.correo },
          { cedula: validandoCampos.cedula },
          { token: tokenAuth },
        ],
      },
    });

    // 7. Si existe el usuario, retornar error
    if (usuarioExistente) {
      return retornarRespuestaFunciones("error", "Error, usuario ya existe");
    }

    // 8. Variable para almacenar los datos de la institucion.
    let datosInstitucion;

    // 9. Determinar la institución asociada según el rol del usuario activo.
    if (validaciones.id_rol === 1) {
      datosInstitucion = await prisma.institucion.findFirst({
        where: {
          id: instituciones?.[0].id,
        },
        select: {
          id: true,
          id_pais: true,
          id_estado: true,
          id_municipio: true,
          id_parroquia: true,
        },
      });
    } else {
      datosInstitucion = await prisma.institucion.findFirst({
        where: {
          id: validaciones.id_institucion,
        },
        select: {
          id: true,
          id_pais: true,
          id_estado: true,
          id_municipio: true,
          id_parroquia: true,
        },
      });
    }

    // 10. Cifrar la contraseña del nuevo usuario.
    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    // 11. Si la encriptación falla, retornar error.
    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message
      );
    }

    // 12. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validaciones correctas", {
      id_usuario: validaciones.id_usuario,
      cedula: validandoCampos.cedula,
      nombre: validandoCampos.nombre,
      apellido: validandoCampos.apellido,
      claveEncriptada: claveEncriptada.claveEncriptada,
      correo: validandoCampos.correo,
      id_rol: validandoCampos.id_rol,
      autorizar: validandoCampos.autorizar,
      institucion: datosInstitucion,
      id_institucion:
        validaciones.id_rol === 1
          ? instituciones
          : [{ id: datosInstitucion.id }],
      id_creador: validaciones.id_usuario,
      token: tokenAuth,
    });
  } catch (error) {
    // 13. Manejo de errores inesperados.
    console.log("Error interno validar crear usuario: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear usuario"
    );
  }
}
