/**
 @fileoverview Servicio para validar el inicio de sesión de un usuario. Verifica los campos de entrada,
 consulta la base de datos, compara la contraseña, genera un token de autenticación y determina la
 redirección según el rol. Utiliza Prisma como ORM, servicios personalizados para validación y cifrado,
 y una utilidad para estructurar respuestas internas. @module services/validarInicioSesion
*/

import ValidarCampos from "@/services/ValidarCampos"; // Servicio para validar campos de entrada
import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves"; // Servicio para comparar contraseñas
import AuthTokens from "@/libs/AuthTokens"; // Servicio para generar tokens de sesión
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para estructurar respuestas internas

/**
 Valida el proceso de inicio de sesión de un usuario. Comprueba los campos, verifica credenciales,
 genera token y determina redirección.
 @async
 @function validarInicioSesion
 @param {string} correo - Correo electrónico del usuario.
 @param {string} clave - Contraseña ingresada por el usuario.
 @returns {Promise<Object>} Objeto con estado, mensaje y datos del usuario o error.
*/
export default async function validarInicioSesion(correo, clave) {
  try {
    // 1. Validar los campos de entrada
    const validandoCampos = ValidarCampos.validarCamposLogin(correo, clave);

    // 2. Si la validación falla retornamos una respuesta
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    // 3. Buscar usuario en la base de datos
    const datosInicioSesion = await prisma.usuario.findFirst({
      where: { correo: validandoCampos.correo },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        correo: true,
        clave: true,
        id_rol: true,
        borrado: true,
        validado: true,
        createdAt: true,
        MiembrosInstitucion: {
          select: {
            id: true,
            nombre: true,
          },
        },
        MiembrosDepartamentos: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    // 4. Verificar si el usuario existe
    if (!datosInicioSesion) {
      return retornarRespuestaFunciones("error", "Error usuario no existe...", {
        correo: validandoCampos.correo,
      });
    }

    // 5. Verificar si el usuario está validado
    if (!datosInicioSesion.validado) {
      return retornarRespuestaFunciones("error", "Usuario no autorizado...");
    }

    // 6. Verificar si el usuario está eliminado o suspendido
    if (datosInicioSesion.borrado) {
      return retornarRespuestaFunciones(
        "error",
        "Usuario eliminado o suspendido..."
      );
    }

    // 7. Comparar la contraseña ingresada con la almacenada
    const claveEncriptada = await CifrarDescifrarClaves.compararClave(
      validandoCampos.clave,
      datosInicioSesion.clave
    );

    // 8. Si la validación falla retornamos una respuesta
    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message
      );
    }

    // 9. Determinar la ruta de redirección según el rol del usuario
    const redirecciones = {
      1: "/dashboard/master",
      2: "/dashboard/administrador",
      3: "/dashboard/director",
      4: "/dashboard/empleados",
    };

    // 10. Tomamos la direccion por el id_rol o la raiz
    const redirect = redirecciones[datosInicioSesion.id_rol] || "/";

    // 11. Generar token de sesión
    const crearTokenInicioSesion = AuthTokens.tokenInicioSesion(
      validandoCampos.correo,
      datosInicioSesion.id_rol
    );

    // 12. Si la validación falla retornamos una respuesta
    if (crearTokenInicioSesion.status === "error") {
      return retornarRespuestaFunciones(
        crearTokenInicioSesion.status,
        crearTokenInicioSesion.message
      );
    }

    // 13. Retornar respuesta exitosa con datos del usuario y token
    return retornarRespuestaFunciones("ok", "Iniciando sesion", {
      token: crearTokenInicioSesion.token,
      cookie: crearTokenInicioSesion.cookieOption,
      redirect: redirect,
      id_usuario: datosInicioSesion.id,
      datosUsuario: datosInicioSesion,
    });
  } catch (error) {
    // 14. Manejo de errores inesperados
    console.error(`Error interno validar inicio sesion: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar inicio sesion"
    );
  }
}
