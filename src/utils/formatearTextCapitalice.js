/**
 @fileoverview Funciones para formatear títulos y capitalizar texto. Permiten aplicar estilos
 tipográficos personalizados, útiles en interfaces de usuario, generación de reportes o normalización
 de datos textuales. @module utils/formatearTitulos
*/

/**
 Capitaliza cada palabra de un texto, convirtiendo la primera letra en mayúscula y el resto en minúscula.
 Ejemplo: "hola mundo" → "Hola Mundo"
 @function capitalizarTitulo
 @param {string} texto - Cadena de texto a capitalizar.
 @returns {string} Texto con cada palabra capitalizada.
*/
export function capitalizarTitulo(texto) {
  try {
    const nuevoTexto = texto
      .split(" ")
      .map(
        (palabra) =>
          palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
      )
      .join(" ");

    return nuevoTexto;
  } catch (error) {
    // Error inesperado al capitalizar titulo
    console.log("Error interno al capitalizar titulo: " + error);

    // Retorno del error inesperado al capitalizar titulo
    return false;
  }
}

/**
 Formatea un título con estilo personalizado:
 - La primera palabra se capitaliza (solo primera letra en mayúscula).
 - Las palabras restantes se convierten completamente en mayúsculas.
 Ejemplo: "registro de usuario nuevo" → "Registro DE USUARIO NUEVO"
 @function formatoTituloPersonalizado
 @param {string} texto - Cadena de texto a formatear.
 @returns {string} Texto formateado con estilo mixto.
*/
export function formatoTituloPersonalizado(texto) {
  try {
    const palabras = texto.trim().split(" ");

    // Si solo hay una palabra, se capitaliza normalmente
    if (palabras.length === 1) {
      return (
        palabras[0].charAt(0).toUpperCase() + palabras[0].slice(1).toLowerCase()
      );
    }

    // Capitaliza la primera palabra
    const primera =
      palabras[0].charAt(0).toUpperCase() + palabras[0].slice(1).toLowerCase();

    // Convierte el resto de palabras a mayúsculas
    const resto = palabras
      .slice(1)
      .map((p) => p.toUpperCase())
      .join(" ");

    const nuevoTituloPersonalizado = `${primera} ${resto}`;
    return nuevoTituloPersonalizado;
  } catch (error) {
    // Error inesperado al capitalizar titulo
    console.log("Error interno al capitalizar titulo personalizado: " + error);

    // Retorno del error inesperado al capitalizar titulo personalizado
    return false;
  }
}
