/**
@fileoverview Controlador de API para la consulta de consejos comunales por ID de comuna.
Este archivo maneja la lógica para obtener todos los consejos comunales de una comuna específica a
través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un servicio
de validaciónpara asegurar la validez de la consulta.
@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarConsejoIdComuna from "@/services/consejos-comunales/validarConsultarConsejosIdComuna"; // Servicio para validar la consulta de consejos comunales por ID de comuna.

/**
  Maneja las solicitudes HTTP GET para obtener consejos comunales asociados a una comuna específica.
  @async@function GET@param {Request} request - Objeto de la solicitud que contiene la información
  del circuito a consultar.
  @returns Promise - Una respuesta HTTP en formato JSON con los consejos comunales encontrados o un error.
*/

export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarConsejoIdComuna(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Consulta los consejos comunales en la base de datos por ID de comuna
    const consejosComunales = await prisma.consejo.findMany({
      where: { id_comuna: validaciones.id_comuna, borrado: false },
    });

    // 4. Condición de respuesta si no se encuentran consejos comunales
    if (!consejosComunales) {
      return generarRespuesta(
        "ok",
        "No hay consejos comunales en esta comuna.",
        { consejos: [] },
        404
      );
    }

    // 5. Condición de éxito: se encontraron consejos comunales
    return generarRespuesta(
      "ok",
      "Consejos comunales encontrados.",
      { consejos: consejosComunales },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno al consultar consejos comunales: ${error}`);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al consultar consejos comunales.",
      {},
      500
    );
  }
}
