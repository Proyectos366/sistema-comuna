/**
@fileoverview Controlador de API para la consulta de circuitos comunales no validados.
Este archivo maneja la lógica para obtener todos los circuitos que no han sidovalidados y 
que están activos en la base de datos a través de una solicitud GET.
Utiliza Prisma para la interacción con la base de datos y un servicio de validación de tokens.
@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { cookies } from "next/headers"; // Módulo para gestionar cookies en las solicitudes.
import AuthTokens from "@/libs/AuthTokens"; // Servicio para manejar la lógica de autenticación de tokens.
import nombreToken from "@/utils/nombreToken"; // Función utilitaria para obtener el nombre del token de autenticación.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
/**
Maneja las solicitudes HTTP GET para obtener todos los circuitos comunales no validados.@async@function GET@returns {Promise Una respuesta HTTP en formato JSON con los circuitos obtenidos o un error.
*/

export async function GET() {
  try {
    // 1. Recupera las cookies y descifra el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    // 2. Verifica si el token es válido
    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    // Se obtiene el correo del token descifrado
    const correo = descifrarToken.correo;

    // 3. Consulta todos los circuitos no borrados y no validados en la base de datos
    const todosCircuitos = await prisma.circuito.findMany({
      where: {
        borrado: false,
        validado: false,
      },
    });

    // 4. Condición de error si no se obtienen circuitos
    if (!todosCircuitos) {
      return generarRespuesta(
        "error",
        "Error, al consultar circuitos...",
        {},
        400
      );
    } else {
      // 5. Condición de éxito: se encontraron circuitos
      return generarRespuesta(
        "ok",
        "Todas los circuitos...",
        {
          circuitos: todosCircuitos,
        },
        201
      );
    }
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (circuitos): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (circuitos)",
      {},
      500
    );
  }
}
