/**
 * Valida nombres que permiten letras (con acentos y ñ), números, espacios y un número opcional al final.
 */
export const regexGeneral = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+(?:\s+\d+)?$/i;