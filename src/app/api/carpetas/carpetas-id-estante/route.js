/**
 @fileoverview Controlador de API para la consulta de todas las carpetas por el id del estante.
 Este archivo maneja la lógica para obtener todos los registros de carpetas en la base de datos a
 través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un servicio
 de validación previo. @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarCarpetasIdEstante from "@/services/carpetas/validarConsultarCarpetasIdEstante"; // Servicio para validar la consulta de carpetas.
import procesarDetallesEstante from "@/utils/procesarDetallesEstante";
import procesarDetallesCarpeta from "@/utils/procesarDetallesCarpeta";

/**
 Maneja las solicitudes HTTP GET para obtener todas las carpetas por id_estante.
 @async
 @function GET
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON can las carpetas obtenidas o un error.
*/
export async function GET(request) {
  try {
    // 1. Valida la operación de consulta utilizando el servicio correspondiente
    const validaciones = await validarConsultarCarpetasIdEstante(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.codigo ? validaciones.codigo : 400,
      );
    }

    // 3. Consulta todas las carpetas por id_estante
    const todasCarpetas = await prisma.carpeta.findMany({
      where: {
        id_estante: validaciones.id_estante,
        borrado: false,
      },
      include: {
        archivos: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            size: true,
          },
          orderBy: {
            nombre: "asc",
          },
        },
        _count: {
          select: {
            archivos: true,
          },
        },
      },
      orderBy: [
        {
          codigo: "asc",
        },
      ],
    });

    // 4. Condición si no se obtuvieron registros
    if (todasCarpetas.length === 0) {
      return generarRespuesta(
        "ok",
        "Aún no hay carpetas",
        { carpetas: [] },
        200,
      );
    }

    // 5. Procesar los datos (calcular pesos por carpeta)
    const carpetasConPesos = procesarDetallesCarpeta(todasCarpetas);

    // 5. Condición de éxito: se encontraron carpetas
    return generarRespuesta(
      "ok",
      "Todas las carpetas",
      {
        carpetas: carpetasConPesos,
      },
      201,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno carpetas por id estante: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno carpetas por id estante",
      {},
      500,
    );
  }
}
