/**
 @fileoverview Controlador de API para la consulta de estados por país. Este archivo maneja la
 lógica para obtener los estados de un país específico desde la base de datos a través de una
 solicitud GET.
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarEstadosIdPais from "@/services/estados/validarConsultarEstadosIdPais";

/**
 * Maneja las solicitudes HTTP GET para obtener los estados por idPais.
 * @async
 * @function GET
 * @param {Request} request - Objeto de solicitud HTTP.
 * @param {Object} context - Contexto que incluye los parámetros de la ruta.
 * @returns {Promise<Response>} - Respuesta HTTP con los estados o un mensaje de error.
 */
export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarEstadosIdPais(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta los estados en la base de datos por ID de pais
    const estados = await prisma.estado.findMany({
      where: {
        borrado: false,
        id_pais: validaciones.id_pais,
      },
    });

    // 4. Condición de respuesta si no se encuentran estados
    if (!estados || estados.length === 0) {
      return generarRespuesta(
        "error",
        "No se encontraron estados...",
        {
          estados: [],
        },
        404
      );
    }

    // 5. Condición de éxito: se encontraron los estados por idPais
    return generarRespuesta(
      "ok",
      "Estados encontrados...",
      { estados: estados },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log("Error interno consultar estados por idPais: " + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno consultar estados por idPais.",
      {},
      500
    );
  }
}
