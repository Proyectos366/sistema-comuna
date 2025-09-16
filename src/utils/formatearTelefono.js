/**
 @fileoverview Función para formatear números de teléfono venezolanos. Elimina caracteres no numéricos
 y aplica un formato legible con guiones y puntos. Útil para mostrar teléfonos en interfaces de usuario
 de forma estandarizada. @module utils/formatearTelefono
*/

import { soloNumerosRegex } from "./constantes"; // Expresión regular para eliminar caracteres no numéricos

/**
 Formatea un número de teléfono venezolano en formato legible. Ejemplo: "04121234567" → "0412-123.45.67"
 @function formatearTelefono
 @param {string|number} numero - Número de teléfono en formato numérico o cadena.
 @returns {string|boolean} Teléfono formateado o mensaje de error si es inválido.
*/
export function formatearTelefono(numero) {
  try {
    // 1. Convierte a string y elimina cualquier carácter que no sea número
    const limpio = numero.toString().replace(soloNumerosRegex, "");

    // 2. Verifica que el número tenga exactamente 11 dígitos
    if (limpio.length !== 11) return "Número inválido";

    // 3. Divide el número en partes para aplicar formato
    const prefijo = limpio.slice(0, 4); // Ej. 0412
    const parte1 = limpio.slice(4, 7); // Ej. 123
    const parte2 = limpio.slice(7, 9); // Ej. 45
    const parte3 = limpio.slice(9); // Ej. 67

    // 4. Retorna el número formateado con guiones y puntos
    return `${prefijo}-${parte1}.${parte2}.${parte3}`;
  } catch (error) {
    // 5. Manejo de errores inesperados
    console.log("Error interno al formatear telefono: " + error);

    // Retorno de false por el error inesperado
    return false;
  }
}
