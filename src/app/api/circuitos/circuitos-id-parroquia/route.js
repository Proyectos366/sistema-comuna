/**
  @fileoverview Controlador de API para la consulta de circuitos asociados a una parroquia.
  Este archivo maneja la lógica para obtener todos los circuitos de una parroquia específica
  a través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un
  servicio de validación para asegurar la validez de los datos de entrada.
  @module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarCircuitosIdParroquia from "@/services/circuitos/validarConsultarCircuitosIdParroquia"; // Servicio para validar la consulta de circuitos por ID de parroquia.

/**
  Maneja los solicitudes HTTP GET para obtener circuitos asociados a una parroquia específica.
  @async@function GET
  @param {Request} request - Objeto de la solicitud que contiene información sobre el circuito a consultar.
  @returns {Promise<object>} - Una respuesta HTTP en formato JSON con los circuitos encontrados o un error.
*/

export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarCircuitosIdParroquia(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Consulta los circuitos en la base de datos por ID de parroquia
    const circuitosIdParroquia = await prisma.circuito.findMany({
      where: { id_parroquia: validaciones.id_parroquia, borrado: false },
      include: {
        voceros: {
          select: {
            id: true,
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            cedula: true,
            telefono: true,
            correo: true,
            edad: true,
            genero: true,
          },
        },
      },
    });

    // 4. Condición de respuesta si no se encuentran circuitos
    if (!circuitosIdParroquia) {
      return generarRespuesta(
        "ok",
        "No hay circuitos en esta parroquia.",
        { circuitos: [] },
        404
      );
    }

    // 5. Condición de éxito: se encontraron circuitos
    return generarRespuesta(
      "ok",
      "Circuitos encontrados.",
      { circuitos: circuitosIdParroquia },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno al consultar circuitos: ${error}`);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al consultar circuitos.",
      {},
      500
    );
  }
}
