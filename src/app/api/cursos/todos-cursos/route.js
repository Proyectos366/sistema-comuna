/**
@fileoverview Controlador de API para la consulta de todos los cursos. Este archivo maneja la
lógica para obtener todos los cursos de la base de datosa través de una solicitud GET. Utiliza
Prisma para la interacción con la base de datos y un sistema de autenticaciónpara validar
el acceso.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { cookies } from "next/headers"; // Módulo para gestionar cookies en las solicitudes.
import AuthTokens from "@/libs/AuthTokens"; // Servicio para manejar la lógica de autenticación de tokens.
import nombreToken from "@/utils/nombreToken"; // Utilidad para obtener el nombre del token de autenticación.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
/**
Maneja las solicitudes HTTP GET para obtener todos los cursos.@async@function GET@returns {Promise>} - Una respuesta HTTP en formato JSON con los cursos encontrados o un error.
*/

export async function GET() {
  try {
    // 1. Recupera las cookies y descifra el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    // 2. Verifica si el token es válido
    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    // 3. Consulta todos los cursos en la base de datos
    const todosCursos = await prisma.curso.findMany({
      where: { borrado: false },
      include: {
        voceros: {
          select: {
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            cedula: true,
            telefono: true,
            correo: true,
            edad: true,
            f_n: true,
            genero: true,
            comunas: {
              select: {
                nombre: true, // Trae el nombre de la comuna
              },
            },
            consejos: {
              select: {
                nombre: true,
              },
            },
            circuitos: {
              select: {
                nombre: true,
              },
            },
            parroquias: {
              select: {
                nombre: true,
              },
            },
          },
        },
        formaciones: {
          include: {
            modulos: {
              include: {
                asistencias: true, // Relaciona módulos con asistencias
              },
            },
          },
        },
        asistencias: true,
      },
    });

    // 4. Condición de error si no se obtienen cursos
    if (!todosCursos) {
      return generarRespuesta(
        "error",
        "Error, al consultar cursos...",
        {},
        400
      );
    }

    // 5. Condición de éxito: se encontraron cursos
    return generarRespuesta(
      "ok",
      "Todas los cursos...",
      {
        cursos: todosCursos,
      },
      201
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (cursos): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (cursos)",
      {},
      500
    );
  }
}
