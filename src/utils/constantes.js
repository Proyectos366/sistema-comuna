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
