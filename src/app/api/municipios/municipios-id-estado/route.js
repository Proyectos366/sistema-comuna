/**
 @fileoverview Controlador de API para la consulta de municipios por estado. Este archivo maneja la
 lógica para obtener los municipios de un estado específico desde la base de datos a través de una
 solicitud GET.
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma";
import validarConsultarMunicipiosIdEstado from "@/services/municipios/validarConsultarMunicipiosIdEstado";
import { generarRespuesta } from "@/utils/respuestasAlFront";

/**
 * Maneja las solicitudes HTTP GET para obtener los municipios por idEstado.
 * @async
 * @function GET
 * @param {Request} request - Objeto de solicitud HTTP.
 * @param {Object} context - Contexto que incluye los parámetros de la ruta.
 * @returns {Promise<Response>} - Respuesta HTTP con los municipios o un mensaje de error.
 */
export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarMunicipiosIdEstado(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta los municipios en la base de datos por ID de estado
    const municipios = await prisma.municipio.findMany({
      where: {
        borrado: false,
        id_estado: validaciones.id_estado,
      },
    });

    // 4. Condición de respuesta si no se encuentran municipios
    if (!municipios || municipios.length === 0) {
      return generarRespuesta(
        "error",
        "No se encontraron municipios...",
        {
          municipios: [],
        },
        404
      );
    }

    // 5. Condición de éxito: se encontraron los municipios por idEstado
    return generarRespuesta(
      "ok",
      "Municipios encontrados...",
      { municipios: municipios },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log("Error interno consultar municipios por idEstado: " + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno consultar municipios por idEstado.",
      {},
      500
    );
  }
}
