/**
  @fileoverview Controlador de API para la consulta de todos los circuitos existentes. Este archivo
  maneja la lógica para obtener todos los circuitos de la base de datos a través de una solicitud GET.
  Utiliza Prisma para la interacción con la base de datos y un servicio de validación para asegurar
  la validez de la consulta.
@module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarTodosCircuitos from "@/services/circuitos/validarConsultarTodosCircuitos"; // Servicio para validar la consulta de todos las circuitos.

/**
  Maneja las solicitudes HTTP GET para obtener todos los circuitos.
  @async@function GET@returns {Promise<object>} - Una respuesta HTTP en formato JSON con los
  circuitos encontrados o un error.
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodosCircuitos();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // Variable para almacenar los circuitos consultados
    let todosCircuitos;

    // 3. Consulta de circuitos según el rol del usuario
    if (validaciones.id_rol === 1) {
      todosCircuitos = await prisma.circuito.findMany({
        where: {
          borrado: false,
        },
      });
    } else {
      todosCircuitos = await prisma.circuito.findMany({
        where: {
          id_parroquia: {
            in: validaciones.id_parroquias,
          },
          borrado: false, // opcional, si quieres excluir circuitos marcados como borrados
        },
      });
    }

    // 4. Condición de error si no se obtienen circuitos
    if (!todosCircuitos) {
      return generarRespuesta(
        "error",
        "Error, al consultar circuitos...",
        {},
        400
      );
    }

    // 5. Condición de éxito: se encontraron circuitos
    return generarRespuesta(
      "ok",
      "Todos los circuitos...",
      {
        circuitos: todosCircuitos,
      },
      201
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (circuitos): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (circuitos)",
      {},
      500
    );
  }
}
