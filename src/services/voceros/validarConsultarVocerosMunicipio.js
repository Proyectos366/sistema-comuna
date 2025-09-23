/**
 @fileoverview Función utilitaria para validar la identidad del usuario y, si aplica,
 obtener las parroquias asociadas a su municipio para consultar voceros.
 @module services/voceros/validarConsultarVocerosMunicipio
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo mediante el token de autenticación

/**
 Valida los datos del usuario activo y, si no es administrador, obtiene las parroquias
 asociadas a su municipio para limitar la consulta de voceros.
 @async
 @function validarConsultarVocerosMunicipio
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarConsultarVocerosMunicipio() {
  try {
    // 1. Validar identidad del usuario activo mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Inicializar variable para almacenar los IDs de parroquias si aplica.
    let idParroquias;

    // 4. Si el usuario no es master (rol distinto de 1), obtener las parroquias de su municipio.
    if (validaciones.id_rol !== 1) {
      const parroquias = await prisma.parroquia.findMany({
        where: {
          id_municipio: validaciones.id_municipio,
        },
        select: {
          id: true,
        },
      });

      // Extraer solo los IDs de las parroquias.
      idParroquias = parroquias.map((p) => p.id);
    }

    // 5. Retornar los datos validados, incluyendo las parroquias si aplica.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_parroquias: idParroquias,
      id_rol: validaciones.id_rol,
    });
  } catch (error) {
    // 6. Manejo de errores inesperados.
    console.log("Error interno validar consultar voceros municipio: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar voceros municipio"
    );
  }
}
