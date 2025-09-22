/**
 @fileoverview Función utilitaria para extraer y validar el token de autenticación
 desde las cookies, descifrarlo y obtener el correo electrónico y rol del usuario.
 @module utils/obtenerCorreoToken
*/

import { cookies } from "next/headers"; // API para acceder a las cookies en el entorno Next.js
import AuthTokens from "@/libs/AuthTokens"; // Utilidad para cifrar y descifrar tokens de autenticación
import nombreToken from "@/utils/nombreToken"; // Nombre clave del token almacenado en cookies
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas

/**
 Extrae el token de autenticación desde las cookies, lo descifra y retorna el correo y rol del usuario.
 @async
 @function obtenerCorreoToken
 @returns {Promise<Object>} Respuesta estructurada con el correo y rol del usuario, o error si falla.
*/

export default async function obtenerCorreoToken() {
  try {
    // 1. Obtener el almacén de cookies del entorno actual.
    const cookieStore = await cookies();

    // 2. Extraer el valor del token usando el nombre definido en 'nombreToken'.
    const token = cookieStore.get(nombreToken)?.value;

    // 3. Descifrar el token para obtener los datos del usuario.
    const descifrarToken = AuthTokens.descifrarToken(token);

    // 4. Si el token no es válido o no se puede descifrar, retornar error.
    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    // 5. Normalizar el correo electrónico a minúsculas.
    const correoObtenido = descifrarToken.correo;
    const correo = correoObtenido.toLowerCase();

    // 6. Retornar el correo y el rol del usuario si todo es correcto.
    return retornarRespuestaFunciones("ok", "Correo obtenido correcto...", {
      correo: correo,
      id_rol: descifrarToken.id_rol,
    });
  } catch (error) {
    // 7. Manejo de errores inesperados.
    console.log("Error interno obtener correo: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno obtener correo..."
    );
  }
}
