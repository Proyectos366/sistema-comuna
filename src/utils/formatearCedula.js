/**
 @fileoverview Función para formatear números de cédula venezolana. Elimina caracteres no numéricos
 y aplica un formato legible con puntos y prefijo "V-". Útil para mostrar cédulas de forma
 estandarizada en interfaces de usuario. @module utils/formatearCedula
*/

import { soloNumerosRegex } from "./constantes"; // Expresión regular para eliminar caracteres no numéricos

/**
 Formatea una cédula venezolana en formato legible. Ejemplo: "20202202" → "V-20.202.202"
 @function formatearCedula
 @param {string|number} cedula - Cédula en formato numérico o cadena.
 @returns {string} Cédula formateada con puntos y prefijo "V-".
*/
export function formatearCedula(cedula) {
  try {
    // 1. Convierte a string y elimina caracteres no numéricos
    const valor = cedula.toString().replace(soloNumerosRegex, "");
    let partes = [];

    // 2. Formateo para cédulas de longitud 7 o más
    if (valor.length >= 7) {
      // Ejemplo: 20202202 → V-20.202.202
      partes.push(valor.slice(0, valor.length - 6)); // Parte inicial
      partes.push(valor.slice(-6, -3)); // Parte intermedia
      partes.push(valor.slice(-3)); // Parte final
    } else if (valor.length >= 6) {
      // Ejemplo: 220220 → V-2.202.20
      partes.push(valor.slice(0, valor.length - 6));
      partes.push(valor.slice(-6, -3));
      partes.push(valor.slice(-3));
    } else {
      // 3. Cédulas cortas → sin puntos, solo prefijo
      return `V-${valor}`;
    }

    // 4. Une las partes con puntos y agrega prefijo "V-"
    return `V-${partes.join(".")}`;
  } catch (error) {
    // 5. Error inesperado al formatear cedula
    console.log("Error interno al formatear cedula: " + error);

    // Retorno de false por el error inesperado
    return false;
  }
}
