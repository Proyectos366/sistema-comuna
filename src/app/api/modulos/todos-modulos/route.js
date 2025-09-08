/**
@fileoverview Controlador de API para la consulta de todos los módulos. Este archivo maneja
la lógica para obtener todos los módulos de la base de datos a través de una solicitud GET.
Utiliza Prisma para la interacción con la base de datos y un sistema de autenticación para validar
el acceso.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { cookies } from "next/headers"; // Módulo para gestionar cookies en las solicitudes.
import AuthTokens from "@/libs/AuthTokens"; // Servicio para manejar la lógica de autenticación de tokens.
import nombreToken from "@/utils/nombreToken"; // Utilidad para obtener el nombre del token de autenticación.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
/**
Maneja las solicitudes HTTP GET para obtener todos los módulos.@async@function GET@returns {Promise>} - Una respuesta HTTP en formato JSON con los módulos encontrados o un error.
*/

export async function GET() {
  try {
    // 1. Recupera las cookies y el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    // 2. Descifra el token de autenticación
    const descifrarToken = AuthTokens.descifrarToken(token);

    // 3. Verifica si el token es válido
    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    // 4. Consulta todos los módulos en la base de datos
    const todosModulos = await prisma.modulo.findMany();

    // 5. Condición de error si no se obtienen módulos
    if (!todosModulos) {
      return generarRespuesta(
        "error",
        "Error, al consultar modulos...",
        {},
        400
      );
    }

    // 6. Condición de éxito: se encontraron módulos
    return generarRespuesta(
      "ok",
      "Todos los modulos...",
      {
        modulos: todosModulos,
      },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno consultar (modulos): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (modulos)",
      {},
      500
    );
  }
}
