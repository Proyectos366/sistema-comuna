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
    // Extraer el salt (primeros 16 bytes)
    const salt = bufferEncriptado.subarray(0, 16);

    // Extraer el IV (siguientes 16 bytes)
    const iv = bufferEncriptado.subarray(16, 32);

    // Extraer los datos encriptados (el resto)
    const datosEncriptados = bufferEncriptado.subarray(32);

    // Crear el descifrador usando el salt extraído
    const descifrador = crypto.createDecipheriv(
      algoritmo,
      crypto.scryptSync(claveSecreta, salt, 32),
      iv,
    );

    // Desencriptar
    const desencriptado = Buffer.concat([
      descifrador.update(datosEncriptados),
      descifrador.final(),
    ]);

    return desencriptado;
  }

  /**
   Cifra un archivo utilizando una clave secreta y un algoritmo de cifrado.
   @static
   @function cifrarArchivo
   @param {Buffer} buffer - El buffer del archivo a cifrar.
   @param {string} claveSecreta - La clave secreta para el cifrado.
   @param {string} algoritmo - El algoritmo de cifrado utilizado.
   @returns {Buffer} El buffer del archivo cifrado con salt + IV incluido.
  */
  static cifrarArchivo(buffer, claveSecreta, algoritmo) {
    // Generar salt aleatorio de 16 bytes
    const salt = crypto.randomBytes(16);

    // Generar IV aleatorio de 16 bytes
    const iv = crypto.randomBytes(16);

    // Derivar clave usando scrypt con salt aleatorio
    const key = crypto.scryptSync(claveSecreta, salt, 32);

    // Crear el cifrador
    const cipher = crypto.createCipheriv(algoritmo, key, iv);

    // Cifrar y concatenar: salt + iv + datos cifrados
    const bufferCifrado = Buffer.concat([
      salt,
      iv,
      cipher.update(buffer),
      cipher.final(),
    ]);

    return bufferCifrado;
  }
}
