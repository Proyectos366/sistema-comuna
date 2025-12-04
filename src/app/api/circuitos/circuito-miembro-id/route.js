/**
  @fileoverview Controlador de API para la consulta de un circuito asociado a un miembro. Este
  archivo maneja la lógica para obtener el circuito relacionado con un miembro específico a
  través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un servicio
  de validación para asegurar la validez de la consulta.@module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import validarConsultarCircuitoMiembroId from "@/services/circuitos/validarConsultarCircuitoMiembroId"; // Servicio para validar la consulta del circuito por ID de miembro.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.

/**
  Maneja las solicitudes HTTP GET para obtener el circuito asociado a un miembro.
  @async@function GET
  @returns {Promise - Una respuesta HTTP en formato JSON con el circuito encontrado o un error.}
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarCircuitoMiembroId();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta el circuito en la base de datos asociado a la parroquia
    const circuitoMiembro = await prisma.circuito.findFirst({
      where: {
        id_parroquia: validaciones.id_parroquia,
        borrado: false,
      },
    });

    // 4. Condición de error si no se encuentra el circuito
    if (!circuitoMiembro) {
      return generarRespuesta(
        "error",
        "Error, al consultar circuito...",
        {},
        400
      );
    }

    // 5. Condición de éxito: se encontró la circuito
    return generarRespuesta(
      "ok",
      "Circuito encontrado...",
      {
        circuitos: circuitoMiembro,
      },
      201
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (circuito): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (circuito)",
      {},
      500
    );
  }
}
