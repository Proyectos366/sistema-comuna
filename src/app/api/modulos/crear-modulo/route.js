/**
 @fileoverview Controlador de API para la creación de un nuevo módulo. Este archivo maneja la
 lógica para crear un nuevo módulo en la base de datos a través de una solicitud POST.
 Utiliza Prisma para la interacción con la base de datos y un servicio de validación para asegurar
 la validez de los datos. @module
 */

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearModulo from "@/services/modulos/validarCrearModulo"; // Servicio para validar los datos de creación del módulo.

/**
 * Maneja las solicitudes HTTP POST para crear un nuevo módulo.
 * @async
 * @function POST
 * @param {Request} request - Objeto de la solicitud que contiene el nombre del módulo a crear.
 * @returns {Promise - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
 */

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearModulo(nombre);

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 4. Crea un nuevo módulo en la base de datos
    const nuevoModulo = await prisma.modulo.create({
      data: {
        nombre: validaciones.nombre,
        id_usuario: validaciones.id_usuario,
        borrado: false,
      },
    });

    // 5. Condición de error si no se crea el módulo
    if (!nuevoModulo) {
      return generarRespuesta("error", "Error, no se creo el modulo", {}, 400);
    }

    // 6. Condición de éxito: el módulo fue creado correctamente
    return generarRespuesta(
      "ok",
      "Modulo creado...",
      {
        modulo: nuevoModulo,
      },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (modulos): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (modulos)", {}, 500);
  }
}
