/**
 @fileoverview Controlador de API para servir archivos almacenados en el servidor. Este endpoint
 recibe una ruta relativa como parámetro, verifica su existencia, lee el archivo desde el sistema
 de archivos y lo retorna como respuesta binaria. Utiliza funciones nativas de Node.js para manejo
 de archivos y rutas, y una utilidad personalizada para respuestas HTTP estandarizadas.
 @module api/archivos/mostrarArchivo
*/

import fs from "fs"; // Módulo para operaciones con el sistema de archivos
import path from "path"; // Módulo para manipulación de rutas
import {
  generarRespuesta,
  generarRespuestaBinaria,
} from "@/utils/respuestasAlFront"; // Utilidades para generar respuestas HTTP

/**
 Maneja las solicitudes HTTP GET para mostrar un archivo almacenado en el servidor.
 Verifica la existencia del archivo, lo lee como buffer y lo retorna con el tipo MIME
 correspondiente.
 @async
 @function GET
 @param {Request} request - Solicitud HTTP con el parámetro `path` en la URL.
 @returns {Promise<Response>} Respuesta binaria con el archivo o mensaje de error.
*/

export async function GET(request) {
  try {
    // 1. Extrae los parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    // 2. Verifica que se haya proporcionado una ruta válida
    if (!filePath) {
      return generarRespuesta("error", "Error no hay archivo", {}, 400);
    }


    // Vamos a trabajar desde aqui
    //sdlkjhaosd

    // 3. Construye la ruta absoluta del archivo en el sistema con la institución
    const fullPath = path.join(
      process.cwd(),
      "storage",
      "instituciones",
      filePath,
    );

    // 4. Verifica si el archivo existe en el sistema
    if (!fs.existsSync(fullPath)) {
      return generarRespuesta("error", "Error archivo no encontrada", {}, 404);
    }

    // 5. Lee el contenido del archivo como buffer
    const imageBuffer = fs.readFileSync(fullPath);

    // 6. Determina el tipo MIME según la extensión del archivo
    const ext = path.extname(filePath).slice(1);
    const mimeType =
      ext === "png"
        ? "image/png"
        : ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : "application/octet-stream";

    // 7. Retorna la archivo como respuesta binaria con el tipo MIME correspondiente
    return generarRespuestaBinaria(imageBuffer, mimeType, 200);
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log("Error interno al mostrar img perfil:", error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno mostrar img perfil",
      {},
      500,
    );
  }
}
