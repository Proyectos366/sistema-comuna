/**
 Expresión regular para validar nombres de carpetas. Debe comenzar con un nombre y terminar
 con un número. Ejemplo válido: NUMERO 01, carpeta rosada 001
*/

export const carpetaRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+ \d+$/i;
