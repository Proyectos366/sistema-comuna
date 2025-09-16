/**
 @fileoverview Función utilitaria para estructurar respuestas internas en funciones o servicios.
 Retorna un objeto plano con estado, mensaje y datos adicionales, útil para flujos no HTTP. A
 diferencia de respuestas HTTP, esta función no genera encabezados ni códigos de estado.
 @module utils/respuestaFunciones
*/

/**
 Genera una respuesta estructurada para funciones internas. Ideal para servicios, validaciones o
 procesos que no requieren respuesta HTTP directa.
 @function retornarRespuestaFunciones
 @param {string} status - Estado de la operación ("ok", "error", etc.).
 @param {string} message - Mensaje descriptivo del resultado.
 @param {Object} [data={}] - Datos adicionales que se incluirán en la respuesta.
 @returns {Object} Objeto con estructura: { status, message, ...data }
*/
export default function retornarRespuestaFunciones(status, message, data = {}) {
  return {
    status: status,
    message: message,
    ...data,
  };
}
