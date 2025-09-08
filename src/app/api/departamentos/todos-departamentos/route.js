/**
@fileoverview Controlador de API para la consulta de todos los departamentos. Este archivo maneja
la lógica para obtener todos los departamentos de una institucióna través de una solicitud GET.
Utiliza Prisma para la interacción con la base de datos y un servicio de validación para asegurar
la validez de la consulta.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import validarConsultarTodosDepartamentos from "@/services/departamentos/validarConsultarTodosDepartamentos"; // Servicio para validar la consulta de todos los departamentos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
/**
Maneja las solicitudes HTTP GET para obtener todos los departamentos de una institución.@async@function GET@returns {Promise<object>} - Una respuesta HTTP en formato JSON con los departamentos encontrados o un error.
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodosDepartamentos();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta todos los departamentos en la base de datos
    const todosDepartamentos = await prisma.departamento.findMany({
      where: {
        id_institucion: validaciones.id_institucion,
        borrado: false,
      },
    });

    // 4. Condición de error si no se obtienen departamentos
    if (!todosDepartamentos) {
      return generarRespuesta(
        "error",
        "Error, al consultar todos los departamentos...",
        {},
        400
      );
    } else {
      // 5. Condición de éxito: se encontraron departamentos
      return generarRespuesta(
        "ok",
        "Todas los departamentos...",
        {
          departamentos: todosDepartamentos,
        },
        201
      );
    }
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (departamentos): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (departamentos)",
      {},
      500
    );
  }
}
