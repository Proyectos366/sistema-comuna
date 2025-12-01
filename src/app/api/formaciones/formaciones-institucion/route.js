/**
  @fileoverview Controlador de API para la consulta de todas las formaciones de una institucion. Este
  archivo maneja la lógica para obtener todas las formaciones por departamento de la base de datos a
  través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un servicio
  de validación para asegurar la validez de la consulta.@module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarFormacionesInstitucion from "@/services/formaciones/validarConsultarFormacionesInstitucion"; // Servicio para validar la consulta de todas las formaciones.
/**
  Maneja las solicitudes HTTP GET para obtener todas las formaciones.
  @async@function GET
  @returns {Promise>} - Una respuesta HTTP en formato JSON con las formaciones encontradas o un error.
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarFormacionesInstitucion();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todasFormaciones = await prisma.formacion.findMany({
      where: {
        borrado: false,
        culminada: false,
        OR: [
          { id_institucion: 1 },
          { id_departamento: 1 },
          {
            AND: [{ id_institucion: null }, { id_departamento: null }],
          },
        ],
      },
      include: { modulos: true },
    });

    // 4. Condición de error si no se obtienen formaciones
    if (!todasFormaciones) {
      return generarRespuesta(
        "error",
        "Error, al consultar formaciones...",
        {},
        400
      );
    }
    // 5. Condición de éxito: se encontraron formaciones
    return generarRespuesta(
      "ok",
      "Todas las formaciones...",
      {
        formaciones: todasFormaciones,
      },
      201
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (formaciones): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (formaciones)",
      {},
      500
    );
  }
}
