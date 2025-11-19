/**
 @fileoverview Controlador de API para la consulta de parroquias por municipio. Este archivo maneja la
 lógica para obtener las parroquias de un municipio específico desde la base de datos a través de una
 solicitud GET.
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma";
import validarConsultarParroquiasIdMunicipio from "@/services/parroquias/validarConsultarParroquiasIdMunicipio";
import { generarRespuesta } from "@/utils/respuestasAlFront";

/**
 * Maneja las solicitudes HTTP GET para obtener los parroquias por idMunicipio.
 * @async
 * @function GET
 * @param {Request} request - Objeto de solicitud HTTP.
 * @param {Object} context - Contexto que incluye los parámetros de la ruta.
 * @returns {Promise<Response>} - Respuesta HTTP con las parroquias o un mensaje de error.
 */
export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarParroquiasIdMunicipio(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta las parroquias en la base de datos por ID de municipio
    const parroquias = await prisma.parroquia.findMany({
      where: {
        borrado: false,
        id_municipio: validaciones.id_municipio,
      },
    });

    // 4. Condición de respuesta si no se encuentran parroquias
    if (!parroquias || parroquias.length === 0) {
      return generarRespuesta(
        "error",
        "No se encontraron parroquias...",
        {
          parroquias: [],
        },
        404
      );
    }

    // 5. Condición de éxito: se encontraron los parroquias por idmunicipio
    return generarRespuesta(
      "ok",
      "Parroquias encontradas...",
      { parroquias: parroquias },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log("Error interno consultar parroquias por idMunicipio: " + error);

    // Retorna una respuesta de error con un código de municipio 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno consultar parroquias por idMunicipio.",
      {},
      500
    );
  }
}
