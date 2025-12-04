/**
 @fileoverview Función utilitaria para validar la identidad del usuario y determinar los circuitos que
 puede consultar en función de su rol y ubicación geográfica (municipio que pertenece).
 @module services/circuitos/validarConsultarTodosCircuitos
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida la identidad del usuario para consultar circuitos, determinando qué datos puede ver según su
 rol y ubicación.
 @async
 @function validarConsultarTodosCircuitos
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación y los datos del usuario.
*/
export default async function validarConsultarTodosCircuitos() {
  try {
    // 1. Obtener y validar los datos del usuario (correo y rol) a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Se inicializa la variable para almacenar los IDs de las parroquias.
    let idParroquias;

    // 4. Si el rol del usuario no es master (ID 1), se buscan las parroquias de su municipio.
    if (validaciones.id_rol !== 1) {
      const parroquias = await prisma.parroquia.findMany({
        where: {
          id_municipio: validaciones.id_municipio,
        },
        select: {
          id: true,
        },
      });

      idParroquias = parroquias.map((p) => p.id);
    }

    // 5. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_parroquias: idParroquias,
      id_rol: validaciones.id_rol,
    });
  } catch (error) {
    // 6. Manejo de errores inesperados.
    console.log(`Error interno validar consultar todos circuitos: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todos circuitos"
    );
  }
}
