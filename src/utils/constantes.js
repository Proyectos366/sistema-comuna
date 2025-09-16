/**
 @fileoverview Módulo de constantes y expresiones regulares utilizadas en validaciones. Incluye
 rutas del proyecto y patrones para validar campos comunes como teléfonos, correos, contraseñas,
 cédulas, RIF, entre otros. Facilita la reutilización y centralización de reglas.
 @module utils/constantesValidaciones
*/
import path from "path"; // Módulo nativo para manipulación de rutas de archivos

/**
 Ruta absoluta al directorio raíz del proyecto (carpeta "src"). Utilizada para resolver rutas internas
 de forma consistente.
*/
export const rutaAlProyecto = path.resolve(process.cwd(), "src");

/**
 Expresión regular para validar números de teléfono venezolanos que comienzan con 0 y tienen
 exactamente 11 dígitos. Ejemplo válido: 04121234567
*/
export const phoneRegex = /^0[0-9]{10}$/;

/**
 Expresión regular para validar cédulas venezolanas. Deben comenzar con un número distinto de cero
 y tener entre 7 y 8 dígitos. Ejemplo válido: 12345678
*/
export const cedulaRegex = /^[1-9][0-9]{6,7}$/;

/**
 Expresión regular para validar contraseñas seguras. Requiere al menos una minúscula, una mayúscula,
 un número y un carácter especial. Longitud permitida: entre 8 y 16 caracteres.
*/
export const claveRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

/**
 Expresión regular para validar correos electrónicos. Compatible con formatos estándar y dominios
 comunes.
*/
export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 Expresión regular para validar edad entre 18 y 99 años. Útil para formularios de registro o
 verificación de mayoría de edad.
*/
export const edadRegex = /^(1[89]|[2-9][0-9])$/;

/**
 Expresión regular para validar números de módulo entre 1 y 9. Puede usarse para identificar secciones
 o niveles.
*/
export const moduloRegex = /^[1-9]$/;

/**
 Expresión regular para validar textos que solo contengan letras (mayúsculas y minúsculas), espacios
 y caracteres especiales del español como ñ y vocales acentuadas.
*/
export const textRegex = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/;

/**
 Expresión regular para validar el formato del RIF venezolano. Ejemplo válido: V-12345678-9
*/
export const rifRegex = /^[VEJPGCL]-\d{8}-\d$/;

/**
 Expresión regular para detectar cualquier carácter que no sea número. Útil para limpiar cadenas y
 extraer solo los dígitos.
*/
export const soloNumerosRegex = /\D/g;

/**
 Expresión regular para validar que una cadena contenga solo números. Ejemplo válido: "123456"
*/
export const validarSoloNumerosRegex = /^\d+$/;

/**
 Expresión regular para validar números de teléfono venezolanos fijos y móviles. Incluye códigos como
 0212, 0412, 0414, etc.
*/
export const phoneVenezuelaRegex = /^(02\d{2}|04(12|14|16|24|26))\d{7}$/;

/**
 Expresión regular para verificar si el segundo dígito de un número telefónico venezolano móvil
 pertenece a los operadores válidos (2 o 4).
*/
export const digitoDosPhoneVenezuelaRegex = /[24]/;

/**
 Expresión regular para quitar los caracteres, ejemplo: . / letra.
*/
export const sinCaracteresRegex = /[a-zA-Z.\-]/g;

/**
 Expresión regular para validar un formato de fecha a ISO
*/
export const fechaFormatoIsoRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(Z)?$/;
