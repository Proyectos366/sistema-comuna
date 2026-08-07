/**
 @fileoverview Controlador de API para servir archivos almacenados en el servidor. Este endpoint recibe
 un ID de archivo como parámetro, delega la validación de tokens, roles, existencia y desencriptación
 a una función utilitaria, y retorna el archivo como respuesta binaria con el tipo MIME adecuado.
 @module api/archivos/mostrarArchivo
*/

import {
  generarRespuesta,
  generarRespuestaBinaria,
} from "@/utils/respuestasAlFront";
import validarMostrarArchivoId from "@/services/archivos/validarMostrarArchivoId";
import registrarEventoSeguro from "@/libs/trigget";

/**
 Maneja las solicitudes HTTP GET para mostrar un archivo almacenado en el servidor mediante su ID.
 @async
 @function GET
 @param {Request} request - Solicitud HTTP con el parámetro `idArchivo` en la URL
 @returns {Promise<Response>} Respuesta binaria con el archivo desencriptado o mensaje de error
*/
export async function GET(request) {
  try {
    // 1. Delegar toda la lógica pesada y de seguridad a la función utilitaria
    const validaciones = await validarMostrarArchivoId(request);

    // 2. Si la función utilitaria determinó un fallo en cualquier capa
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "archivo",
        accion: "INTENTO_FALLIDO_MOSTRAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al mostrar el archivo",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.codigo ? validaciones.codigo : 400,
      );
    }

    // 3. Si la validación es exitosa ('ok'), extraemos los datos procesados
    const { bufferDesencriptado, mimeType } = validaciones;

    // 4. Retornar el archivo desencriptado con su tipo MIME y cabeceras
    return generarRespuestaBinaria(bufferDesencriptado, mimeType, 200);
  } catch (error) {
    // 5. Manejo de errores inesperados globales
    console.log("Error interno al mostrar archivo:", error);

    return generarRespuesta(
      "error",
      "Error interno al mostrar archivo",
      {},
      500,
    );
  }
}
