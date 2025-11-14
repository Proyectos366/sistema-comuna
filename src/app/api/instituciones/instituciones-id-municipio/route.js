/**
 @fileoverview Controlador de API para la consulta de instituciones por municipio. Este archivo maneja
 la lógica para obtener las instituciones de un municipio específico desde la base de datos a través
 de una solicitud GET.
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma";
import validarConsultarInstitucionesIdMunicipio from "@/services/instituciones/validarConsultarInstitucionesIdMunicipio";
import { generarRespuesta } from "@/utils/respuestasAlFront";

/**
 * Maneja las solicitudes HTTP GET para obtener las instituciones por idMunicipio.
 * @async
 * @function GET
 * @param {Request} request - Objeto de solicitud HTTP.
 * @param {Object} context - Contexto que incluye los parámetros de la ruta.
 * @returns {Promise<Response>} - Respuesta HTTP con las instituciones o un mensaje de error.
 */
export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarInstitucionesIdMunicipio(
      request
    );

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta las instituciones en la base de datos por ID de municipio
    const instituciones = await prisma.institucion.findMany({
      where: {
        id_municipio: validaciones.id_municipio,
      },
    });

    // 4. Condición de respuesta si no se encuentran instituciones
    if (!instituciones || instituciones.length === 0) {
      return generarRespuesta(
        "error",
        "No se encontraron instituciones...",
        {
          instituciones: [],
        },
        404
      );
    }

    // 5. Condición de éxito: se encontraron los instituciones por idMunicipio
    return generarRespuesta(
      "ok",
      "Instituciones encontradas...",
      { instituciones: instituciones },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(
      "Error interno consultar instituciones por municipio: " + error
    );

    // Retorna una respuesta de error con un código de municipio 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno consultar instituciones por municipio.",
      {},
      500
    );
  }
}
