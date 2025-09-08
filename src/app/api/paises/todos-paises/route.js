/**
 @fileoverview Controlador de API para la consulta de todos los países. Este archivo maneja la
 lógica para obtener todos los países registrados en la base de datos mediante una solicitud
 HTTP GET. Utiliza Prisma para realizar consultas relacionales e incluye validaciones previas
 para asegurar el acceso autorizado. * @module
*/

// 📦 Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarTodosPaises from "@/services/paises/validarConsultarTodosPaises"; // Servicio para validar la consulta de países.

/**
 * Maneja las solicitudes HTTP GET para obtener todos los países.
 * @async
 * @function GET
 * @returns {Promise<Response>} - Una respuesta HTTP en formato JSON con los países encontrados o un error.
 */

export async function GET() {
  try {
    // 1. Ejecuta validaciones previas a la consulta
    const validaciones = await validarConsultarTodosPaises();

    // 2. Si la validación falla, retorna error
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta todos los países no borrados, incluyendo relaciones anidadas
    const todosPaises = await prisma.pais.findMany({
      where: {
        borrado: false,
      },
      include: {
        estados: {
          include: {
            municipios: {
              include: {
                parroquias: true,
                instituciones: true,
              },
            },
          },
        },
      },
    });

    // 4. Si no se obtienen países, retorna error
    if (!todosPaises) {
      return generarRespuesta(
        "error",
        "Error, al consultar paises...",
        {},
        400
      );
    }

    // 5. Retorna los países encontrados con estado exitoso
    return generarRespuesta(
      "ok",
      "Todos los paises...",
      {
        paises: todosPaises,
      },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno consultar (paises): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (paises)",
      {},
      500
    );
  }
}
