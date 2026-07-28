/**
 @fileoverview Controlador de API para servir archivos almacenados en el servidor. Este endpoint recibe
 una ruta relativa como parámetro, verifica su existencia, desencripta el archivo y lo retorna como
 respuesta binaria con el tipo MIME adecuado. Utiliza funciones nativas de Node.js para manejo de archivos
 y rutas, y utilidades personalizadas para respuestas HTTP estandarizadas.
 @module api/archivos/mostrarArchivo
*/

import fs from "fs";
import path from "path";
import {
  generarRespuesta,
  generarRespuestaBinaria,
} from "@/utils/respuestasAlFront";
import CifrarDescifrarArchivo from "@/libs/CifrarDescifrarArchivo";

// Clave secreta para desencriptar archivos (definida en variables de entorno)
const claveSecreta = process.env.CIFRADO_CLAVE;

// Algoritmo de cifrado utilizado (definido en variables de entorno)
const algoritmo = process.env.CIFRADO_ALGORITMO;

/**
 Maneja las solicitudes HTTP GET para mostrar un archivo almacenado en el servidor. Verifica la existencia
 del archivo, lo desencripta y lo retorna con el tipo MIME correspondiente y disposición inline para
 visualización en navegador.
 @async
 @function GET
 @param {Request} request - Solicitud HTTP con el parámetro `path` en la URL
 @returns {Promise<Response>} Respuesta binaria con el archivo desencriptado o mensaje de error
*/
export async function GET(request) {
  try {
    // 1. Extraer el parámetro de ruta de la URL
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    // 2. Validar que se haya proporcionado una ruta
    if (!filePath) {
      return generarRespuesta(
        "error",
        "No se proporcionó la ruta del archivo",
        {},
        400,
      );
    }

    // 3. Construir la ruta absoluta del archivo
    const fullPath = path.join(process.cwd(), filePath);

    // 4. Verificar si el archivo existe físicamente
    if (!fs.existsSync(fullPath)) {
      return generarRespuesta("error", "El archivo no existe", {}, 404);
    }

    // 5. Leer el archivo encriptado desde el sistema
    const bufferEncriptado = fs.readFileSync(fullPath);

    // 6. Desencriptar el archivo usando la clave y algoritmo configurados
    const bufferDesencriptado = CifrarDescifrarArchivo.desencriptarArchivo(
      bufferEncriptado,
      claveSecreta,
      algoritmo,
    );

    // 7. Determinar el tipo MIME según la extensión
    const mimeTypes = {
      pdf: "application/pdf",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mimeType = mimeTypes[ext] || "application/octet-stream";

    // 8. Retornar el archivo desencriptado con su tipo MIME
    return generarRespuestaBinaria(bufferDesencriptado, mimeType, 200);
  } catch (error) {
    // 9. Manejo de errores inesperados
    console.log("Error interno al mostrar archivo:", error);
    return generarRespuesta(
      "error",
      "Error interno al mostrar el archivo",
      {},
      500,
    );
  }
}
