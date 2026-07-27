/**
 @fileoverview Controlador de API para la consulta de todos los archivos por el id de la carpeta.
 Este archivo maneja la lógica para obtener todos los registros de archivos en la base de datos a
 través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un servicio
 de validación previo. @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarArchivosIdCarpeta from "@/services/archivos/validarConsultarArchivosIdCarpeta"; // Servicio para validar la consulta de archivos.

/**
 Maneja las solicitudes HTTP GET para obtener todos los archivos por id_carpeta.
 @async
 @function GET
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON con los archivos obtenidos o un error.
*/
export async function GET(request) {
  try {
    // 1. Valida la operación de consulta utilizando el servicio correspondiente
    const validaciones = await validarConsultarArchivosIdCarpeta(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.codigo ? validaciones.codigo : 400,
      );
    }

    // 3. Consulta todos los archivos por id_carpeta
    const todosArchivos = await prisma.archivo.findMany({
      where: {
        id_carpeta: validaciones.id_carpeta,
        borrado: false,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        alias: true,
        nombre_original: true,
        nombre_sistema: true,
        codigo: true,
        hash: true,
        path: true,
        extension: true,
        tipo: true,
        size: true,
        borrado: true,
        createdAt: true,
      },
    });

    // 4. Condición si no se obtuvieron registros
    if (todosArchivos.length === 0) {
      return generarRespuesta(
        "ok",
        "Aún no hay archivos",
        { archivos: [] },
        200,
      );
    }

    // 5. Condición de éxito: se encontraron archivos
    return generarRespuesta(
      "ok",
      "Todos los archivos",
      {
        archivos: todosArchivos,
      },
      200,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno archivos por id carpeta: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno archivos por id carpeta",
      {},
      500,
    );
  }
}
