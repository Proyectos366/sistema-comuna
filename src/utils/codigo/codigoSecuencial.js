/**
 Genera un código de identificación formateado. 
 @param {string} codDepa - El código del departamento (ej: "VEN-01-01-05-0000-002")
 @param {string} prefijo - El prefijo del tipo de elemento (ej: "-EST-", "-CARP-", "-ARCH-")
 @param {number|null} cantidad - La cantidad actual de elementos
 @returns {string} El código completo generado
*/
export function generarCodigoSecuencial(codDepa, prefijo, cantidad) {
  // Si la cantidad es null o undefined, inicia en 0
  const numero = cantidad ?? 0;

  // Convierte el número a string y le agrega ceros a la izquierda (4 dígitos)
  const numeroCodigo = String(numero).padStart(4, "0");

  // Limpia el prefijo asegurando que tenga guiones si el usuario no los incluye
  const prefijoLimpio = prefijo.startsWith("-") ? prefijo : `-${prefijo}-`;

  return codDepa.toUpperCase() + prefijoLimpio + numeroCodigo;
}
