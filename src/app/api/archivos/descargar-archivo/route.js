/**
 @fileoverview Endpoint para descargar archivos almacenados en el servidor. Este controlador recibe
 un id del archivo, valida el acceso y retorna el archivo desencriptado con cabecera de descarga.
 @module api/archivos/descargarArchivo
*/

import { generarRespuesta, generarRespuestaBinaria } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarDescargarArchivoId from "@/services/archivos/validarDescargarArchivoId";

export async function GET(request) {
  try {
    const validaciones = await validarDescargarArchivoId(request);

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
        validaciones.codigo || 400,
      );
    }

    const { bufferDesencriptado, mimeType, contentDisposition } = validaciones;

    console.log(bufferDesencriptado, mimeType, contentDisposition);
    

    // 1. Reutilizamos la misma función exacta que ya te funciona para el visor
    ///const respuesta = generarRespuestaBinaria(bufferDesencriptado, mimeType, 200);

    // 2. Le inyectamos manualmente la cabecera que obliga al navegador a descargarlo
    //respuesta.headers.set("Content-Disposition", contentDisposition);

    return generarRespuestaBinaria(bufferDesencriptado, mimeType, 200);
  } catch (error) {
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

// import { generarRespuesta } from "@/utils/respuestasAlFront";
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
//         datosAntes: { id_archivo: validaciones.id_archivo },
//         datosDespues: validaciones,
//       });

//       return generarRespuesta(
//         validaciones.status,
//         validaciones.message,
//         {},
//         validaciones.codigo || 400,
//       );
//     }

//     const buffer = Buffer.from(validaciones.bufferDesencriptado);
    
//     const blob = new Blob([buffer], { type: validaciones.mimeType });

//     return new Response(blob, {
//       status: 200,
//       headers: {
//         "Content-Type": validaciones.mimeType,
//         "Content-Disposition": validaciones.contentDisposition,
//         "Content-Length": buffer.length.toString(),
//       },
//     });
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







// /**
//  @fileoverview Endpoint para descargar archivos almacenados en el servidor. Este controlador recibe
//  un id del archivo, valida el acceso y retorna el archivo desencriptado con cabecera de descarga.
//  @module api/archivos/descargarArchivo
// */

// import { generarRespuesta } from "@/utils/respuestasAlFront";
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
//         datosAntes: { id_archivo: validaciones.id_archivo },
//         datosDespues: validaciones,
//       });

//       return generarRespuesta(
//         validaciones.status,
//         validaciones.message,
//         {},
//         validaciones.codigo || 400,
//       );
//     }

//     return new Response(validaciones.bufferDesencriptado, {
//       status: 200,
//       headers: {
//         "Content-Type": validaciones.mimeType,
//         "Content-Disposition": validaciones.contentDisposition,
//       },
//     });
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
