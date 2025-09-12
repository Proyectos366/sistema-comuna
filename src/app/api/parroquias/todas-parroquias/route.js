/**
 @fileoverview Controlador de API para consultar todas las parroquias asociadas a un municipio.
 Este endpoint valida el acceso, realiza la consulta en la base de datos y retorna los resultados.
 Utiliza Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/parroquias/consultarTodas
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarConsultarTodasParroquias from "@/services/parroquias/validarConsultarTodasParroquias"; // Servicio para validar la consulta

/**
 * Maneja las solicitudes HTTP GET para obtener todas las parroquias de un municipio.
 * Valida el contexto de la solicitud, consulta la base de datos y retorna una respuesta estructurada.
 *
 * @async
 * @function GET
 * @returns {Promise<Response>} Respuesta HTTP con la lista de parroquias o un mensaje de error.
 */

export async function GET() {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await validarConsultarTodasParroquias();

    // 2. Si la validación falla, retorna una respuesta de error
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta todas las parroquias asociadas al municipio validado
    const todasParroquias = await prisma.parroquia.findMany({
      where: {
        id_municipio: validaciones.id_municipio,
        borrado: false,
      },
    });

    // 4. Verifica si se obtuvieron resultados válidos
    if (!todasParroquias) {
      return generarRespuesta(
        "error",
        "Error, al consultar parroquias...",
        {},
        400
      );
    }

    // 5. Retorna la lista de parroquias en una respuesta exitosa
    return generarRespuesta(
      "ok",
      "Todas las parroquias...",
      {
        parroquias: todasParroquias,
      },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (parroquias): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (parroquias)",
      {},
      500
    );
  }
}
