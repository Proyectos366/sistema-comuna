/**
 @fileoverview Utilidades para generar respuestas HTTP estandarizadas en Next.js. Incluye funciones
 para retornar respuestas JSON estructuradas y contenido binario como archivos o imágenes. Facilita
 la consistencia en controladores y endpoints de API. @module utils/respuestasAlFront
*/

import { NextResponse } from "next/server"; // Utilidad de Next.js para construir respuestas HTTP

/**
 Genera una respuesta HTTP en formato JSON con estructura estandarizada. Ideal para APIs que retornan
 estado, mensaje y datos adicionales.
 @function generarRespuesta
 @param {string} status - Estado de la operación ("ok", "error", etc.).
 @param {string} message - Mensaje descriptivo para el cliente.
 @param {Object} [data={}] - Datos adicionales que se incluirán en la respuesta.
 @param {number} statusCode - Código de estado HTTP (ej. 200, 400, 500).
 @returns {NextResponse} Respuesta HTTP en formato JSON.
*/
export function generarRespuesta(status, message, data = {}, statusCode) {
  return NextResponse.json(
    {
      status: status,
      message: message,
      ...data,
    },
    { status: statusCode }
  );
}

/**
 Genera una respuesta HTTP con contenido binario (Buffer), como archivos o imágenes. Permite especificar
 el tipo MIME y el código de estado.
 @function generarRespuestaBinaria
 @param {Buffer} buffer - Contenido binario a enviar en la respuesta.
 @param {string} mimeType - Tipo MIME del contenido (ej. "image/png", "application/pdf").
 @param {number} [statusCode=200] - Código de estado HTTP.
 @returns {NextResponse} Respuesta HTTP con contenido binario.
*/
export function generarRespuestaBinaria(buffer, mimeType, statusCode = 200) {
  return new NextResponse(buffer, {
    status: statusCode,
    headers: {
      "Content-Type": mimeType,
    },
  });
}
