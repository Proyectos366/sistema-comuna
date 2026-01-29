/**
  @fileoverview Controlador de API para la consulta de todos los consejos comunales.
  Este archivo maneja la lógica para obtener todos los consejos comunales de la base de datos a
  través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un
  servicio de validaciónpara asegurar la validez de la consulta.
  @module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarTodosConsejosComunales from "@/services/consejos-comunales/validarConsultarTodosConsejos"; // Servicio para validar la consulta de todos los consejos comunales.

/**
  Maneja las solicitudes HTTP GET para obtener todos los consejos comunales.
  @async
  @function GET
  @returns {Promise} - Una respuesta HTTP en formato JSON con los consejos comunales encontrados o un error.
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodosConsejosComunales();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // Variable para almacenar los consejos comunales consultados
    let todosConsejosComunales;

    // 3. Consulta de consejos según el rol del usuario
    if (validaciones.id_rol === 1) {
      todosConsejosComunales = await prisma.consejo.findMany({
        where: {
          borrado: false,
        },
        include: {
          voceros: true,
        },
      });
    } else {
      todosConsejosComunales = await prisma.consejo.findMany({
        where: {
          id_parroquia: {
            in: validaciones.id_parroquias,
          },
          borrado: false, // opcional, si quieres excluir consejos marcadas como borradas
        },
        include: {
          voceros: true,
        },
      });
    }

    // 4. Condición de error si no se obtienen consejos comunales
    if (!todosConsejosComunales) {
      return generarRespuesta(
        "error",
        "Error, al consultar consejos comunales",
        {},
        400,
      );
    }

    // 5. Condición de éxito: se encontraron consejos comunales
    return generarRespuesta(
      "ok",
      "Todos los consejos comunales",
      {
        consejos: todosConsejosComunales,
      },
      201,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (consejos comunales): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (consejos comunales)",
      {},
      500,
    );
  }
}
