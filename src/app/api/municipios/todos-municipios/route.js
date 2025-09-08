/**
@fileoverview Controlador de API para la consulta de todos los municipios. Este archivo maneja
la lógica para obtener todos los municipios de la base de datos a través de una solicitud GET.
Utiliza Prisma para la interacción con la base de datos y un servicio de validación para asegurar
la validez de la consulta. @module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import validarConsultarTodosMunicipios from "@/services/municipios/validarConsultarTodosMunicipios"; // Servicio para validar la consulta de todos los municipios.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
/**
Maneja las solicitudes HTTP GET para obtener todos los municipios.@async@function GET@returns {Promise<object>} - Una respuesta HTTP en formato JSON con los municipios encontrados o un error.
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodosMunicipios();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta todos los municipios en la base de datos
    const todosMunicipios = await prisma.municipio.findMany({
      where: {
        borrado: false,
      },
    });

    // 4. Condición de error si no se obtienen municipios
    if (!todosMunicipios) {
      return generarRespuesta(
        "error",
        "Error, al consultar municipios...",
        {},
        400
      );
    }

    // 5. Condición de éxito: se encontraron municipios
    return generarRespuesta(
      "ok",
      "Todos los municipios...",
      {
        municipios: todosMunicipios,
      },
      201
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (municipios): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (municipios)",
      {},
      500
    );
  }
}
