/**
@fileoverview Controlador de API para la consulta de circuitos comunales. Este archivo maneja la
lógica para obtener todos los circuitos asociados a una parroquiaa través de una solicitud GET.
Utiliza Prisma para la interacción con la base de datos y un servicio de validaciónde 
autenticación de tokens.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { cookies } from "next/headers"; // Módulo para gestionar cookies en las solicitudes.
import AuthTokens from "@/libs/AuthTokens"; // Servicio para manejar la lógica de autenticación de tokens.
import nombreToken from "@/utils/nombreToken"; // Función utilitaria para obtener el nombre del token de autenticación.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
/**
Maneja las solicitudes HTTP GET para obtener circuitos comunales por parroquia.@async@function GET@param {Request} req - Objeto de la solicitud que contiene información sobre la petición.@returns {Promise - Una respuesta HTTP en formato JSON con los circuitos obtenidos o un error.
*/

export async function GET(req) {
  try {
    // 1. Obtiene el ID de la parroquia desde los parámetros de la solicitud
    const { searchParams } = new URL(req.url);
    const idParroquia = searchParams.get("idParroquia");
    const id_parroquia = Number(idParroquia);

    // 2. Recupera las cookies y descifra el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    // 3. Verifica si el token es válido
    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    // 4. Valida que el ID de parroquia esté presente
    if (!idParroquia) {
      return generarRespuesta(
        "error",
        "El ID de parroquia es obligatorio.",
        {},
        400
      );
    }

    // 5. Consulta los circuitos comunales por parroquia en la base de datos
    const circuitos = await prisma.circuito.findMany({
      where: {
        id_parroquia: id_parroquia,
        borrado: false,
      },
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

    // 6. Condición de error si no se obtienen circuitos
    if (!circuitos) {
      return generarRespuesta(
        "ok",
        "No hay circuitos en esta parroquia.",
        { circuitos: [] },
        200
      );
    }

    // 7. Condición de éxito: se encontraron circuitos
    return generarRespuesta(
      "ok",
      "Circuitos encontrados.",
      { circuitos: circuitos },
      200
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
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
