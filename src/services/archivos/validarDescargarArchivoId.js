/**
 @fileoverview Función utilitaria para validar el ID de un archivo antes de descargarlo. Esta función comprueba
 el token del usuario, valida el ID y prepara los datos para descargar el archivo.
 @module services/archivos/validarDescargarArchivoId
*/

import fs from "fs";
import path from "path";
import prisma from "@/libs/prisma";
import CifrarDescifrarArchivo from "@/libs/CifrarDescifrarArchivo";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "@/services/ValidarCampos";
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken";

const claveSecreta = process.env.CIFRADO_CLAVE;
const algoritmo = process.env.CIFRADO_ALGORITMO;

/**
 Valida las credenciales, comprueba la existencia del registro en la base de datos, 
 verifica permisos departamentales, mitiga riesgos de Path Traversal, valida la existencia 
 física del archivo en disco y retorna sus bytes desencriptados junto con los metadatos de descarga.
 
 @async
 @function validarDescargarArchivoId
 @param {Request} request - Objeto de solicitud HTTP nativo para extraer los parámetros de la URL.
 @returns {Promise<Object>} Objeto estandarizado de respuesta con el estado de la validación y datos binarios/metadatos si es exitosa.
*/
export default async function validarDescargarArchivoId(request) {
  try {
    // 1. Extraer el identificador del archivo desde los parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const idArchivo = searchParams.get("idArchivo");

    // 2. Extraer y validar la sesión/token del usuario solicitante
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar el formato estructural y la existencia del ID del archivo solicitado
    const validarIdArchivo = ValidarCampos.validarCampoId(idArchivo, "archivo");

    if (validarIdArchivo.status === "error") {
      return retornarRespuestaFunciones(
        validarIdArchivo.status,
        validarIdArchivo.message,
        { codigo: 400 },
      );
    }

    // 4. Consultar los metadatos de almacenamiento y restricciones del archivo en la base de datos
    const archivo = await prisma.archivo.findUnique({
      where: { id: validarIdArchivo.id },
      select: {
        nombre_original: true,
        nombre_sistema: true,
        path: true,
        extension: true,
        id_departamento: true,
      },
    });

    if (!archivo) {
      return retornarRespuestaFunciones("error", "Archivo no encontrado", {
        codigo: 404,
        id_usuario: validaciones.id_usuario,
      });
    }

    // 5. Control de acceso basado en roles y pertenencia a departamentos corporativos
    if (
      validaciones.id_rol > 2 &&
      archivo.id_departamento !== validaciones.id_departamento
    ) {
      return retornarRespuestaFunciones("error", "Acceso denegado", {
        id_usuario: validaciones.id_usuario,
        codigo: 403,
      });
    }

    // 6. Definir directorio base absoluto sin enlaces simbólicos
    let BASE_DIR = path.resolve(process.cwd(), "storage", "instituciones");

    if (fs.existsSync(BASE_DIR)) {
      BASE_DIR = fs.realpathSync(BASE_DIR);
    }

    // 7. Normalizar ruta limpiando barras iniciales para evitar concatenación defectuosa o mutilación de caracteres
    const pathLimpio = archivo.path.replace(/\\/g, "/").replace(/^\/+/, "");

    // Si el path de la BD incluye "storage/instituciones/", extraemos solo la parte relativa
    const parteRelativa = pathLimpio.replace(/^storage\/instituciones\//i, "");

    // 8. Resolver la ruta absoluta final del archivo en el disco del servidor
    let fullPath = path.resolve(BASE_DIR, parteRelativa);

    // 9. Si el archivo existe físicamente, obtener su ruta real resuelta
    if (fs.existsSync(fullPath)) {
      fullPath = fs.realpathSync(fullPath);
    }

    // 10. Control estricto de seguridad contra vulnerabilidades de Path Traversal
    if (!fullPath.startsWith(BASE_DIR)) {
      return retornarRespuestaFunciones(
        "error",
        "Acceso denegado: Ruta de archivo inválida",
        {
          codigo: 403,
          id_usuario: validaciones.id_usuario,
        },
      );
    }

    // 11. Verificar existencia física antes de llamar statSync (previene excepciones 500 ENOENT)
    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
      return retornarRespuestaFunciones(
        "error",
        "El archivo físico no existe en el servidor",
        {
          codigo: 404,
          id_usuario: validaciones.id_usuario,
        },
      );
    }

    // 12. Leer el archivo binario del almacenamiento local y aplicar proceso de desencriptación
    const bufferEncriptado = fs.readFileSync(fullPath);
    const bufferDesencriptado = CifrarDescifrarArchivo.desencriptarArchivo(
      bufferEncriptado,
      claveSecreta,
      algorithm,
    );

    // 13. Mapear y determinar el tipo MIME correcto según la extensión del archivo
    const mimeTypes = {
      pdf: "application/pdf",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    const ext =
      archivo.extension?.toLowerCase() ||
      path.extname(archivo.path).slice(1).toLowerCase();
    const mimeType = mimeTypes[ext] || "application/octet-stream";
    const filename = archivo.nombre_original || archivo.nombre_sistema;

    // 14. Estructurar la cabecera Content-Disposition sanitizada compatible con caracteres UTF-8
    const contentDisposition = `attachment; filename="${filename.replace(/"/g, '\\"')}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

    // 15. Retornar payload exitoso con el buffer de datos procesados y cabeceras configuradas
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_archivo: validarIdArchivo.id,
      bufferDesencriptado,
      mimeType,
      contentDisposition,
    });
  } catch (error) {
    // 16. Captura de errores inesperados globales del sistema
    console.log("Error interno validar id archivo descargar: ", error);

    return retornarRespuestaFunciones(
      "error",
      "Error interno validar id archivo descargar",
    );
  }
}

// /**
//  @fileoverview Función utilitaria para validar el ID de un archivo antes de descargarlo. Esta función comprueba
//  el token del usuario, valida el ID y prepara los datos para descargar el archivo.
//  @module services/archivos/validarDescargarArchivoId
// */

// import fs from "fs";
// import path from "path";
// import prisma from "@/libs/prisma";
// import CifrarDescifrarArchivo from "@/libs/CifrarDescifrarArchivo";
// import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
// import ValidarCampos from "@/services/ValidarCampos";
// import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken";

// const claveSecreta = process.env.CIFRADO_CLAVE;
// const algoritmo = process.env.CIFRADO_ALGORITMO;

// export default async function validarDescargarArchivoId(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const idArchivo = searchParams.get("idArchivo");

//     const validaciones = await obtenerDatosUsuarioToken();

//     if (validaciones.status === "error") {
//       return retornarRespuestaFunciones(
//         validaciones.status,
//         validaciones.message,
//       );
//     }

//     const validarIdArchivo = ValidarCampos.validarCampoId(idArchivo, "archivo");

//     if (validarIdArchivo.status === "error") {
//       return retornarRespuestaFunciones(
//         validarIdArchivo.status,
//         validarIdArchivo.message,
//         { codigo: 400 },
//       );
//     }

//     const archivo = await prisma.archivo.findUnique({
//       where: { id: validarIdArchivo.id },
//       select: {
//         nombre_original: true,
//         nombre_sistema: true,
//         path: true,
//         extension: true,
//         id_departamento: true,
//       },
//     });

//     if (!archivo) {
//       return retornarRespuestaFunciones("error", "Archivo no encontrado", {
//         codigo: 404,
//         id_usuario: validaciones.id_usuario,
//       });
//     }

//     if (
//       validaciones.id_rol > 2 &&
//       archivo.id_departamento !== validaciones.id_departamento
//     ) {
//       return retornarRespuestaFunciones("error", "Acceso denegado", {
//         id_usuario: validaciones.id_usuario,
//         codigo: 403,
//       });
//     }

//     // 1. Definir directorio base absoluto sin enlaces simbólicos
//     let BASE_DIR = path.resolve(process.cwd(), "storage", "instituciones");

//     if (fs.existsSync(BASE_DIR)) {
//       BASE_DIR = fs.realpathSync(BASE_DIR);
//     }

//     // 2. Normalizar ruta limpiando barras iniciales para evitar concatenación defectuosa o mutilación de caracteres
//     const pathLimpio = archivo.path.replace(/\\/g, "/").replace(/^\/+/, "");

//     // Si el path de la BD incluye "storage/instituciones/", extraemos solo la parte relativa
//     const parteRelativa = pathLimpio.replace(/^storage\/instituciones\//i, "");

//     // 3. Resolver la ruta absoluta en disco
//     let fullPath = path.resolve(BASE_DIR, parteRelativa);

//     // 4. Si el archivo existe físicamente, obtener su ruta real resuelta
//     if (fs.existsSync(fullPath)) {
//       fullPath = fs.realpathSync(fullPath);
//     }

//     // 5. Control de seguridad contra Path Traversal
//     if (!fullPath.startsWith(BASE_DIR)) {
//       return retornarRespuestaFunciones(
//         "error",
//         "Acceso denegado: Ruta de archivo inválida",
//         {
//           codigo: 403,
//           id_usuario: validaciones.id_usuario,
//         },
//       );
//     }

//     // 6. Verificar existencia física antes de llamar statSync (previene error 500 ENOENT)
//     if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
//       return retornarRespuestaFunciones(
//         "error",
//         "El archivo físico no existe en el servidor",
//         {
//           codigo: 404,
//           id_usuario: validaciones.id_usuario,
//         },
//       );
//     }

//     // 7. Leer y desencriptar
//     const bufferEncriptado = fs.readFileSync(fullPath);
//     const bufferDesencriptado = CifrarDescifrarArchivo.desencriptarArchivo(
//       bufferEncriptado,
//       claveSecreta,
//       algoritmo,
//     );

//     const mimeTypes = {
//       pdf: "application/pdf",
//       xls: "application/vnd.ms-excel",
//       xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       doc: "application/msword",
//       docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     };

//     const ext =
//       archivo.extension?.toLowerCase() ||
//       path.extname(archivo.path).slice(1).toLowerCase();
//     const mimeType = mimeTypes[ext] || "application/octet-stream";
//     const filename = archivo.nombre_original || archivo.nombre_sistema;
//     const contentDisposition = `attachment; filename="${filename.replace(/"/g, '\\"')}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

//     return retornarRespuestaFunciones("ok", "Validacion correcta", {
//       id_usuario: validaciones.id_usuario,
//       id_archivo: validarIdArchivo.id,
//       bufferDesencriptado,
//       mimeType,
//       contentDisposition,
//     });
//   } catch (error) {
//     console.log("Error interno validar id archivo descargar: ", error);

//     return retornarRespuestaFunciones(
//       "error",
//       "Error interno validar id archivo descargar",
//     );
//   }
// }

// /**
//  * @fileoverview Función utilitaria para validar el ID de un archivo antes de descargarlo.
//  * Esta función comprueba el token del usuario, valida el ID y prepara los datos de descarga.
//  * @module services/archivos/validarDescargarArchivoId
//  */

// import fs from "fs";
// import path from "path";
// import prisma from "@/libs/prisma";
// import CifrarDescifrarArchivo from "@/libs/CifrarDescifrarArchivo";
// import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
// import ValidarCampos from "@/services/ValidarCampos";
// import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken";

// const claveSecreta = process.env.CIFRADO_CLAVE;
// const algoritmo = process.env.CIFRADO_ALGORITMO;

// export default async function validarDescargarArchivoId(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const idArchivo =
//       searchParams.get("idArchivo") || searchParams.get("id_archivo");

//     const validaciones = await obtenerDatosUsuarioToken();
//     if (validaciones.status === "error") {
//       return retornarRespuestaFunciones(
//         validaciones.status,
//         validaciones.message,
//         { codigo: validaciones.codigo || 401 },
//       );
//     }

//     const validarIdArchivo = ValidarCampos.validarCampoId(idArchivo, "archivo");

//     if (validarIdArchivo.status === "error") {
//       return retornarRespuestaFunciones(
//         validarIdArchivo.status,
//         validarIdArchivo.message,
//         { codigo: 400 },
//       );
//     }

//     const archivo = await prisma.archivo.findUnique({
//       where: { id: validarIdArchivo.id },
//       select: {
//         nombre_original: true,
//         nombre_sistema: true,
//         path: true,
//         extension: true,
//       },
//     });

//     if (!archivo) {
//       return retornarRespuestaFunciones("error", "Archivo no encontrado", {
//         codigo: 404,
//         id_usuario: validaciones.id_usuario,
//       });
//     }

//     const fullPath = path.join(process.cwd(), archivo.path);

//     // Validación de seguridad: asegurar que la ruta esté dentro del proyecto
//     if (!fullPath.startsWith(process.cwd())) {
//       return retornarRespuestaFunciones("error", "Ruta de archivo inválida", {
//         codigo: 400,
//         id_usuario: validaciones.id_usuario,
//       });
//     }

//     if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
//       return retornarRespuestaFunciones("error", "El archivo no existe", {
//         codigo: 404,
//         id_usuario: validaciones.id_usuario,
//       });
//     }

//     const bufferEncriptado = fs.readFileSync(fullPath);
//     const bufferDesencriptado = CifrarDescifrarArchivo.desencriptarArchivo(
//       bufferEncriptado,
//       claveSecreta,
//       algoritmo,
//     );

//     const mimeTypes = {
//       pdf: "application/pdf",
//       xls: "application/vnd.ms-excel",
//       xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       doc: "application/msword",
//       docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     };

//     const ext =
//       archivo.extension?.toLowerCase() ||
//       path.extname(archivo.path).slice(1).toLowerCase();
//     const mimeType = mimeTypes[ext] || "application/octet-stream";
//     const filename = archivo.nombre_original || archivo.nombre_sistema;
//     const contentDisposition = `attachment; filename="${filename.replace(/"/g, '\\"')}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

//     return retornarRespuestaFunciones("ok", "Validacion correcta", {
//       id_usuario: validaciones.id_usuario,
//       id_archivo: validarIdArchivo.id,
//       bufferDesencriptado,
//       mimeType,
//       contentDisposition,
//     });
//   } catch (error) {
//     console.log("Error interno validar id archivo descargar: ", error);
//     return retornarRespuestaFunciones(
//       "error",
//       "Error interno validar id archivo descargar",
//       { codigo: 500 },
//     );
//   }
// }

// /**
//  @fileoverview Función utilitaria para validar el ID de un archivo antes de descargarlo.
//  Esta función comprueba el token del usuario, valida el ID y prepara los datos de descarga.
//  @module services/archivos/validarDescargarArchivoId
// */

// import fs from "fs";
// import path from "path";
// import prisma from "@/libs/prisma";
// import CifrarDescifrarArchivo from "@/libs/CifrarDescifrarArchivo";
// import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
// import ValidarCampos from "@/services/ValidarCampos";
// import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken";

// const claveSecreta = process.env.CIFRADO_CLAVE;
// const algoritmo = process.env.CIFRADO_ALGORITMO;

// export default async function validarDescargarArchivoId(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const idArchivo =
//       searchParams.get("idArchivo") || searchParams.get("id_archivo");

//     const validaciones = await obtenerDatosUsuarioToken();
//     if (validaciones.status === "error") {
//       return retornarRespuestaFunciones(
//         validaciones.status,
//         validaciones.message,
//         { codigo: validaciones.codigo || 401 },
//       );
//     }

//     const validarIdArchivo = ValidarCampos.validarCampoId(idArchivo, "archivo");

//     if (validarIdArchivo.status === "error") {
//       return retornarRespuestaFunciones(
//         validarIdArchivo.status,
//         validarIdArchivo.message,
//         { codigo: 400 },
//       );
//     }

//     const archivo = await prisma.archivo.findUnique({
//       where: { id: validarIdArchivo.id },
//       select: {
//         nombre_original: true,
//         nombre_sistema: true,
//         path: true,
//         extension: true,
//       },
//     });

//     if (!archivo) {
//       return retornarRespuestaFunciones("error", "Archivo no encontrado", {
//         codigo: 404,
//         id_usuario: validaciones.id_usuario,
//       });
//     }

//     console.log(archivo.path);

//     const fullPath = path.resolve(process.cwd(), archivo.path);

//     console.log(fullPath);

//     if (!fullPath.startsWith(process.cwd())) {
//       return retornarRespuestaFunciones("error", "Ruta de archivo inválida", {
//         codigo: 400,
//         id_usuario: validaciones.id_usuario,
//       });
//     }

//     if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
//       return retornarRespuestaFunciones("error", "El archivo no existe", {
//         codigo: 404,
//         id_usuario: validaciones.id_usuario,
//       });
//     }

//     const bufferEncriptado = fs.readFileSync(fullPath);
//     const bufferDesencriptado = CifrarDescifrarArchivo.desencriptarArchivo(
//       bufferEncriptado,
//       claveSecreta,
//       algoritmo,
//     );

//     const mimeTypes = {
//       pdf: "application/pdf",
//       xls: "application/vnd.ms-excel",
//       xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       doc: "application/msword",
//       docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     };

//     const ext =
//       archivo.extension?.toLowerCase() ||
//       path.extname(archivo.path).slice(1).toLowerCase();
//     const mimeType = mimeTypes[ext] || "application/octet-stream";
//     const filename = archivo.nombre_original || archivo.nombre_sistema;
//     const contentDisposition = `attachment; filename="${filename.replace(/"/g, '\"')}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

//     return retornarRespuestaFunciones("ok", "Validacion correcta", {
//       id_usuario: validaciones.id_usuario,
//       id_archivo: validarIdArchivo.id,
//       bufferDesencriptado,
//       mimeType,
//       contentDisposition,
//     });
//   } catch (error) {
//     console.log("Error interno validar id archivo descargar: ", error);
//     return retornarRespuestaFunciones(
//       "error",
//       "Error interno validar id archivo descargar",
//     );
//   }
// }
