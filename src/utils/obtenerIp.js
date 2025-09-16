/**
 @fileoverview Función para obtener la dirección IP del cliente desde una solicitud HTTP. Intenta
 extraer la IP desde los encabezados comunes utilizados por proxies y servidores. Si no se encuentra,
 retorna "desconocida". Maneja errores internos de forma segura. @module utils/obtenerIp
*/

/**
 Extrae la dirección IP del cliente desde los encabezados HTTP. Prioriza los encabezados `x-forwarded-for`
 y `x-real-ip`, utilizados por proxies reversos.
 @function obtenerIp
 @param {Request} request - Objeto de solicitud HTTP que contiene los encabezados.
 @returns {string|boolean} Dirección IP obtenida o `false` en caso de error.
*/
export default function obtenerIp(request) {
  try {
    // 1. Intenta obtener la IP desde los encabezados comunes
    return (
      request.headers.get("x-forwarded-for") || // IP detrás de proxy
      request.headers.get("x-real-ip") || // IP directa del cliente
      "desconocida" // Valor por defecto si no se encuentra
    );
  } catch (error) {
    // 2. Manejo de errores inesperados
    console.log("Error interno obtener ip: " + error);

    // Retorno de false de errores inesperados
    return false;
  }
}
