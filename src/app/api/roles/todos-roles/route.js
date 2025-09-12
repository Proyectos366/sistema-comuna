/**
 @fileoverview Controlador de API para consultar todos los roles disponibles. Este endpoint valida
 el acceso, realiza la consulta en la base de datos y retorna los roles excluyendo el rol con ID 1
 (posiblemente reservado para administrador). Utiliza Prisma como ORM y servicios personalizados
 para validación y respuesta estandarizada. @module api/roles/consultarTodos
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import validarConsultarTodosRoles from "@/services/roles/validarConsultarTodosRoles"; // Servicio para validar la consulta
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas

/**
 * Maneja las solicitudes HTTP GET para obtener todos los roles del sistema.
 * Valida el contexto de la solicitud, consulta la base de datos y retorna una respuesta estructurada.
 *
 * @async
 * @function GET
 * @returns {Promise<Response>} Respuesta HTTP con la lista de roles o un mensaje de error.
 */

export async function GET() {
  try {
    // 1. Ejecuta la validación previa antes de consultar
    const validaciones = await validarConsultarTodosRoles();

    // 2. Si la validación falla, retorna una respuesta de error
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta todos los roles, excluyendo el rol con ID 1 y los marcados como borrados
    const todosRoles = await prisma.role.findMany({
      where: {
        borrado: false,
        NOT: {
          id: 1,
        },
      },
    });

    // 4. Verifica si se obtuvieron resultados válidos
    if (!todosRoles) {
      return generarRespuesta("error", "Error, al consultar roles...", {}, 400);
    }

    // 5. Retorna la lista de roles en una respuesta exitosa
    return generarRespuesta(
      "ok",
      "Todos los roles...",
      {
        roles: todosRoles,
      },
      200
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (roles): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (roles)",
      {},
      500
    );
  }
}
