/**
 @fileoverview Función utilitaria para obtener los datos completos del usuario activo
 a partir del token de autenticación, incluyendo su rol, institución y departamento.
 @module services/usuarios/obtenerDatosUsuarioToken
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerCorreoToken from "@/utils/obtenerCorreoToken"; // Función para extraer el correo y rol del usuario desde el token

/**
 Obtiene los datos del usuario activo utilizando su correo extraído del token.
 Retorna información como ID, nombre, cédula, rol, institución y departamento.
 @async
 @function obtenerDatosUsuarioToken
 @returns {Promise<Object>} Respuesta estructurada con los datos del usuario o error.
*/
export default async function obtenerDatosUsuarioToken() {
  try {
    // 1. Extraer correo y rol del token de autenticación.
    const validaciones = await obtenerCorreoToken();

    // 2. Si el token es inválido o no contiene datos, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Consultar en la base de datos los datos del usuario por correo.
    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: validaciones.correo },
      select: {
        id: true,
        cedula: true,
        nombre: true,
        MiembrosInstitucion: {
          select: { id: true, nombre: true, id_municipio: true },
        },
        MiembrosDepartamentos: {
          select: { id: true, nombre: true },
        },
      },
    });

    // 4. Si no se encuentra el usuario, retornar error.
    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    // 5. Retornar los datos consolidados del usuario.
    return retornarRespuestaFunciones("ok", "Datos usuario obtenidos...", {
      datosUsuario: datosUsuario,
      cedula: datosUsuario.cedula,
      nombre: datosUsuario.nombre,
      id_usuario: datosUsuario.id,
      correo: validaciones.correo,
      id_rol: validaciones.id_rol,
      MiembrosInstitucion: datosUsuario.MiembrosInstitucion[0],
      id_municipio: datosUsuario?.MiembrosInstitucion?.[0]?.id_municipio,
      id_institucion: datosUsuario?.MiembrosInstitucion?.[0]?.id,
      id_departamento: datosUsuario?.MiembrosDepartamentos?.[0]?.id,
    });
  } catch (error) {
    // 6. Manejo de errores inesperados.
    console.log("Error interno obtener datos usuario: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno obtener datos usuario..."
    );
  }
}
