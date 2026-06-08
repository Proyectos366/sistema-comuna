/**
 @fileoverview Controlador de API para la consulta de todos los archivos. Este archivo maneja la
 lógica para obtener todos los registros de archivos en la base de datos a través de una solicitud
 GET.  Utiliza Prisma para la interacción con la base de datos y un servicio de validación previo.
 @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarTodosArchivos from "@/services/archivos/validarConsultarTodosArchivos"; // Servicio para validar la consulta de archivos.

/**
 Maneja las solicitudes HTTP GET para obtener todos los archivos activos.
 @async
 @function GET
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON con los archivos obtenidos o un error.
*/
export async function GET() {
  try {
    // 1. Valida la operación de consulta utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodosArchivos();

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

    // 4. Consulta todos los archivos no borrados en la base de datos
    const todosArchivos = await prisma.archivo.findMany({
      where: {
        borrado: false,
      },
    });

    // 5. Condición de error si no se obtuvieron registros
    if (!todosArchivos) {
      return generarRespuesta("error", "Error, al consultar archivos", {}, 400);
    }

    // 6. Condición de éxito: se encontraron archivos
    return generarRespuesta(
      "ok",
      "Todos los archivos",
      {
        archivos: todosArchivos,
      },
      201,
    );
  } catch (error) {
    // 7. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno consultar todos archivos: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno consultar todos archivos",
      {},
      500,
    );
  }
}
