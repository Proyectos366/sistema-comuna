/**
 @fileoverview Controlador de API para consultar el perfil del usuario autenticado. Este endpoint
 valida el contexto del usuario, consulta su perfil completo en la base de datos incluyendo su rol,
 departamento e imagen más reciente, y retorna una respuesta estructurada. Utiliza Prisma como ORM y
 servicios personalizados para validación y respuesta estandarizada.
  @module api/usuarios/consultarUsuarioPerfil
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarUsuarioPerfil from "@/services/usuarios/validarUsuarioPerfil"; // Servicio para validar el contexto del usuario

/**
 * Maneja las solicitudes HTTP GET para obtener el perfil del usuario autenticado.
 * Valida el contexto, consulta el perfil completo del usuario en la base de datos
 * y retorna una respuesta estructurada con sus datos.
 *
 * @async
 * @function GET
 * @returns {Promise<Response>} Respuesta HTTP con los datos del perfil del usuario o mensaje de error.
 */

export async function GET() {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await validarUsuarioPerfil();

    // 2. Si la validación falla, retorna error 400
    if (validaciones.status === "error") {
      return generarRespuesta(
        descifrarToken.status,
        descifrarToken.message,
        {},
        400
      );
    }

    // 3. Consulta el perfil del usuario usando el correo validado
    const datosUsuarioPerfil = await prisma.usuario.findFirst({
      where: { correo: validaciones.correo },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        correo: true,
        id_rol: true,
        borrado: true,
        validado: true,
        clave: true,
        createdAt: true,
        MiembrosDepartamentos: {
          select: {
            id: true,
            nombre: true,
          },
        },
        imagenes: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            path: true,
          },
        },
        roles: {
          select: {
            nombre: true,
          },
        },
      },
    });

    // 4. Si no se encuentra el usuario, retorna error 400
    if (!datosUsuarioPerfil) {
      return generarRespuesta("error", "Error, usuario no existe...", {}, 400);
    }

    // 5. Retorna los datos del perfil del usuario en una respuesta exitosa
    return generarRespuesta(
      "ok",
      "Exito, usuario encontrado",
      {
        usuarioPerfil: datosUsuarioPerfil,
      },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log("Error interno, usuario perfil" + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno, usuario perfil...",
      {},
      500
    );
  }
}
