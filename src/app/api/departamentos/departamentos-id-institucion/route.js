/**
 @fileoverview Controlador de API para la consulta de departamentos por institucion. Este archivo maneja
 la lógica para obtener las departamentos de una institucion específico desde la base de datos a través
 de una solicitud GET.
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma";
import validarConsultarDepartamentosIdInstitucion from "@/services/departamentos/validarConsultarDepartamentosIdInstitucion";
import { generarRespuesta } from "@/utils/respuestasAlFront";

/**
 * Maneja las solicitudes HTTP GET para obtener las departamentos por idInstitucion.
 * @async
 * @function GET
 * @param {Request} request - Objeto de solicitud HTTP.
 * @param {Object} context - Contexto que incluye los parámetros de la ruta.
 * @returns {Promise<Response>} - Respuesta HTTP con los departamentos o un mensaje de error.
 */
export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarDepartamentosIdInstitucion(
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

    // 3. Consulta las departamentos en la base de datos por ID de institucion
    const departamentos = await prisma.departamento.findMany({
      where: {
        id_institucion: validaciones.id_institucion,
      },
    });

    // 4. Condición de respuesta si no se encuentran departamentos
    if (!departamentos || departamentos.length === 0) {
      return generarRespuesta(
        "error",
        "No se encontraron departamentos...",
        {
          departamentos: [],
        },
        404
      );
    }

    // 5. Condición de éxito: se encontraron los departamentos por idInstitucion
    return generarRespuesta(
      "ok",
      "departamentos encontradas...",
      { departamentos: departamentos },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(
      "Error interno consultar departamentos por institucion: " + error
    );

    // Retorna una respuesta de error con un código de institucion 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno consultar departamentos por institucion.",
      {},
      500
    );
  }
}
