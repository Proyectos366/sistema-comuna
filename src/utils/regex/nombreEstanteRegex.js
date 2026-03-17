/**
 Expresión regular para validar nombres de estantes. Debe comenzar con "estante"
 (insensible a mayúsculas/minúsculas) y terminar con un número.
 Ejemplo válido: ESTANTE NUMERO 01, estante rosado 001
*/

export const estanteRegex = /^estante [a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+ \d+$/i;
