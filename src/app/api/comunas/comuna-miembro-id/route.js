/**
  @fileoverview Controlador de API para la consulta de una comuna asociada a un miembro. Este
  archivo maneja la lógica para obtener la comuna relacionada con un miembro específico a
  través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un servicio
  de validación para asegurar la validez de la consulta.@module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import validarConsultarComunaMiembroId from "@/services/comunaes/validarConsultarComunaMiembroId"; // Servicio para validar la consulta de la comuna por ID de miembro.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.

/**
  Maneja las solicitudes HTTP GET para obtener la comuna asociada a un miembro.
  @async@function GET
  @returns {Promise - Una respuesta HTTP en formato JSON con la comuna encontrada o un error.}
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarComunaMiembroId();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta la comuna en la base de datos asociada a la parroquia
    const comunaMiembro = await prisma.comuna.findFirst({
      where: {
        id_parroquia: validaciones.id_parroquia,
        borrado: false,
      },
    });

    // 4. Condición de error si no se encuentra la comuna
    if (!comunaMiembro) {
      return generarRespuesta(
        "error",
        "Error, al consultar comuna...",
        {},
        400
      );
    }

    // 5. Condición de éxito: se encontró la comuna
    return generarRespuesta(
      "ok",
      "Comuna encontrada...",
      {
        comunas: comunaMiembro,
      },
      201
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (comuna): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (comuna)",
      {},
      500
    );
  }
}
