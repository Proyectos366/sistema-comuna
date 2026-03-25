/**
 @fileoverview Controlador de API para la consulta de todos los estantes por el id del departamento.
 Este archivo maneja la lógica para obtener todos los registros de estantes en la base de datos a
 través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un servicio
 de validación previo. @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarEstantesIdDepartamento from "@/services/estantes/validarConsultarEstantesIdDepartamento"; // Servicio para validar la consulta de estantes.
import procesarDetallesEstante from "@/utils/procesarDetallesEstante";

/**
 Maneja las solicitudes HTTP GET para obtener todos los estantes por id_departamento.
 @async
 @function GET
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON con los estantes obtenidos o un error.
*/
export async function GET(request) {
  try {
    // 1. Valida la operación de consulta utilizando el servicio correspondiente
    const validaciones = await validarConsultarEstantesIdDepartamento(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 3. Consulta todos los estantes por id_departamento
    const todosEstantes = await prisma.estante.findMany({
      where: {
        id_departamento: validaciones.id_departamento,
      },
      include: {
        carpetas: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            nivel: true,
            seccion: true,
            _count: {
              select: {
                archivos: true,
              },
            },
          },
          orderBy: {
            nombre: "asc",
          },
        },
        archivos: {
          select: {
            id: true,
            size: true,
          },
        },
        _count: {
          select: {
            carpetas: true,
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
    if (todosEstantes.length === 0) {
      return generarRespuesta(
        "ok",
        "Aún no hay estantes",
        { estantes: [] },
        404,
      );
    }

    // 5. Procesar los datos (calcular pesos por carpeta y por estante)
    const estantesConPesos = procesarDetallesEstante(todosEstantes);

    // 5. Condición de éxito: se encontraron estantes
    return generarRespuesta(
      "ok",
      "Todas los estantes",
      {
        estantes: estantesConPesos,
      },
      201,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno estantes por id departamento: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno estantes por id departamento",
      {},
      500,
    );
  }
}
