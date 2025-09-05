/**
 * @fileoverview Controlador de API para la consulta de todos los cargos.
 * Este archivo maneja la lógica para obtener todos los registros de cargos en la base de datos
 * a través de una solicitud GET.
 * Utiliza Prisma para la interacción con la base de datos y un servicio de validación previo.
 * @module
 */

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarTodosCargos from "@/services/cargos/validarConsultarTodosCargos"; // Servicio para validar la consulta de cargos.

/**
 * Maneja las solicitudes HTTP GET para obtener todos los cargos activos.
 * @async
 * @function GET
 * @returns {Promise<object>} - Una respuesta HTTP en formato JSON con los cargos obtenidos o un error.
 */
export async function GET() {
  try {
    // 1. Valida la operación de consulta utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodosCargos();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      // Retorna una respuesta de error con un código de estado 400 (Bad Request)
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta todos los cargos no borrados en la base de datos
    const todosCargos = await prisma.cargo.findMany({
      where: {
        borrado: false,
      },
    });

    // 4. Condición de error si no se obtuvieron registros
    if (!todosCargos) {
      return generarRespuesta(
        "error",
        "Error, al consultar cargos...",
        {},
        400
      );
    } else {
      // 5. Condición de éxito: se encontraron cargos
      return generarRespuesta(
        "ok",
        "Todas los cargos...",
        {
          cargos: todosCargos,
        },
        201
      );
    }
  } catch (error) {
    // 6. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno consultar (cargos): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (cargos)",
      {},
      500
    );
  }
}
