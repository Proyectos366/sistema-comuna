/**
 @fileoverview Endpoint para descargar archivos almacenados en el servidor. Este controlador recibe
 un id del archivo, valida el acceso y retorna el archivo desencriptado con cabecera de descarga.
 @module api/archivos/descargarArchivo
*/

import {
  generarRespuesta,
  generarRespuestaBinaria,
} from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarDescargarArchivoId from "@/services/archivos/validarDescargarArchivoId";

/**
 Maneja las solicitudes HTTP GET para procesar y descargar un archivo de forma segura.
 Valida la identidad y permisos del usuario, recupera los datos binarios desencriptados
 y retorna el archivo directamente al cliente.
 
 @async
 @function GET
 @param {Request} request - Objeto de solicitud HTTP nativo.
 @returns {Promise<Response>} Respuesta binaria con el archivo o respuesta JSON estandarizada en caso de error.
*/
export async function GET(request) {
  try {
    // 1. Delegar toda la lógica de validación, permisos y desencriptación al servicio utilitario
    const validaciones = await validarDescargarArchivoId(request);

    // 2. Si la función utilitaria determinó un fallo en cualquier capa, registrar intento y retornar error
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "archivo",
        accion: "INTENTO_FALLIDO_DESCARGAR",
        id_objeto: validaciones.id_archivo || 0,
        id_usuario: validaciones.id_usuario || 0,
        descripcion: "Validación fallida al descargar el archivo",
        datosAntes: { id_archivo: validaciones.id_archivo || null },
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.codigo ?? 400,
      );
    }

    // 3. Si la validación es exitosa, extraer el buffer binario y los metadatos necesarios
    const { bufferDesencriptado, mimeType } = validaciones;

    // 4. Retornar el flujo de datos del archivo con su formato y tipo MIME correspondiente
    return generarRespuestaBinaria(bufferDesencriptado, mimeType, 200);
  } catch (error) {
    // 5. Manejo de excepciones e inconsistencias globales no controladas
    console.log("Error interno al descargar archivo:", error);

    return generarRespuesta(
      "error",
      "Error interno al descargar el archivo",
      {},
      500,
    );
  }
}

// /**
//  @fileoverview Endpoint para descargar archivos almacenados en el servidor. Este controlador recibe
//  un id del archivo, valida el acceso y retorna el archivo desencriptado con cabecera de descarga.
//  @module api/archivos/descargarArchivo
// */

// import {
//   generarRespuesta,
//   generarRespuestaBinaria,
// } from "@/utils/respuestasAlFront";
// import registrarEventoSeguro from "@/libs/trigget";
// import validarDescargarArchivoId from "@/services/archivos/validarDescargarArchivoId";

// export async function GET(request) {
//   try {
//     const validaciones = await validarDescargarArchivoId(request);

//     if (validaciones.status === "error") {
//       await registrarEventoSeguro(request, {
//         tabla: "archivo",
//         accion: "INTENTO_FALLIDO_DESCARGAR",
//         id_objeto: validaciones.id_archivo || 0,
//         id_usuario: validaciones.id_usuario || 0,
//         descripcion: "Validación fallida al descargar el archivo",
//         datosAntes: { id_archivo: validaciones.id_archivo || null },
//         datosDespues: validaciones,
//       });

//       return generarRespuesta(
//         validaciones.status,
//         validaciones.message,
//         {},
//         validaciones.codigo || 400,
//       );
//     }

//     const { bufferDesencriptado, mimeType, contentDisposition } = validaciones;

//     return generarRespuestaBinaria(bufferDesencriptado, mimeType, 200);
//   } catch (error) {
//     console.log("Error interno al descargar archivo:", error);

//     return generarRespuesta(
//       "error",
//       "Error interno al descargar el archivo",
//       {},
//       500,
//     );
//   }
// }
