/**
 @fileoverview Clase utilitaria para el cifrado y descifrado de un archivo. Esta clase
 encapsula la lógica de cifrado y descrifado. Utiliza la librería crypto.
 @module libs/CifrarDescifrarArchivo
*/

import crypto from "crypto";

// Clase estática para gestionar tokens de autenticación.
export default class CifrarDescifrarArchivo {
  /**
   Desencripta un archivo utilizando una clave secreta y un algoritmo de cifrado.
   @static
   @function desencriptarArchivo
   @param {Buffer} bufferEncriptado - El buffer del archivo encriptado.
   @param {string} claveSecreta - La clave secreta para el descifrado.
   @param {string} algoritmo - El algoritmo de cifrado utilizado.
   @returns {Buffer} El buffer del archivo desencriptado.
  */

  static desencriptarArchivo(bufferEncriptado, claveSecreta, algoritmo) {
    // Extraer el IV (los primeros 16 bytes)
    const iv = bufferEncriptado.subarray(0, 16);

    // Extraer los datos encriptados (el resto)
    const datosEncriptados = bufferEncriptado.subarray(16);

    // Crear el descifrador
    const descifrador = crypto.createDecipheriv(
      algoritmo,
      crypto.scryptSync(claveSecreta, "salt", 32),
      iv,
    );

    // Desencriptar
    const desencriptado = Buffer.concat([
      descifrador.update(datosEncriptados),
      descifrador.final(),
    ]);

    return desencriptado;
  }
}
