/**
 @fileoverview Controlador de API para la consulta de todas las carpetas. Este archivo maneja la
 lógica para obtener todos los registros de carpetas en la base de datos a través de una solicitud
 GET.  Utiliza Prisma para la interacción con la base de datos y un servicio de validación previo.
 @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarTodasCarpetas from "@/services/carpetas/validarConsultarTodasCarpetas"; // Servicio para validar la consulta de carpetas.

/**
 Maneja las solicitudes HTTP GET para obtener todas las carpetas activas.
 @async
 @function GET
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON con las carpetas obtenidas o un error.
*/
export async function GET() {
  try {
    // 1. Valida la operación de consulta utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodasCarpetas();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 3. Verificar si el usuario tiene permisos.
    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos",
        { codigo: 403 },
      );
    }

    // 4. Consulta todas las carpetas no borradas en la base de datos
    const todasCarpetas = await prisma.carpeta.findMany({
      where: {
        borrado: false,
      },
    });

    // 5. Condición de error si no se obtuvieron registros
    if (!todasCarpetas) {
      return generarRespuesta("error", "Error, al consultar carpetas", {}, 400);
    }

    // 6. Condición de éxito: se encontraron carpetas
    return generarRespuesta(
      "ok",
      "Todas las carpetas",
      {
        carpetas: todasCarpetas,
      },
      201,
    );
  } catch (error) {
    // 7. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno consultar todas carpetas: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno consultar todas carpetas",
      {},
      500,
    );
  }
}
