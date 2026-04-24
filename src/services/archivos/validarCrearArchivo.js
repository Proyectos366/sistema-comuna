/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de un archivo en la base de datos.
 @module services/archivos/validarCrearArchivo
*/

import { randomBytes, scryptSync, createCipheriv, createHash } from "crypto";
import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "@/services/ValidarCampos";
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken";

const claveSecreta = process.env.CIFRADO_CLAVE;
const algoritmo = process.env.CIFRADO_ALGORITMO;
const hash = process.env.CIFRADO_HASH;

/**
 Valida los campos y la lógica de negocio para crear un nuevo archivo.
 @async
 @function validarCrearArchivo
 @param {Request} request - El objeto Request de Next.js App Router
*/
export default async function validarCrearArchivo(request) {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar variables de entorno de cifrado
    if (!claveSecreta || !algoritmo || !hash) {
      return retornarRespuestaFunciones(
        "error",
        "Error variables de entorno de cifrado no configuradas",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 500,
        },
      );
    }

    // 4. Obtener formData del request (App Router)
    const formData = await request.formData();

    // 5. Extraer campos del formData
    const nombre = formData.get("nombre");
    const descripcion = formData.get("descripcion");
    const alias = formData.get("alias");
    const archivo = formData.get("archivo");
    const idCarpeta = formData.get("idCarpeta");

    // 6. Validar que el archivo exista
    if (!archivo || archivo.size === 0) {
      return retornarRespuestaFunciones(
        "error",
        "No se ha proporcionado ningún archivo",
        { codigo: 400 },
      );
    }

    // 7. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validarCampos = ValidarCampos.validarCamposCrearArchivo(
      idCarpeta,
      nombre,
      descripcion,
      alias,
    );

    // 8. Si los campos no son válidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
      );
    }

    // 9. Extraer metadatos del archivo
    const nombreOriginal = archivo.name;
    const tipo = archivo.type;
    const size = archivo.size;
    const ultimaModificacion = new Date(archivo.lastModified);
    //const ultimaModificacion = new Date(archivo.lastModified).toLocaleString();

    // 10. Obtener extensión de forma segura
    const extension = nombreOriginal.split(".").pop()?.toLowerCase();

    const nombreSinExtension = nombreOriginal.substring(
      0,
      nombreOriginal.lastIndexOf("."),
    );

    // 11. Generar nombre de sistema con fecha y hora + hash corto para evitar colisiones
    const timestamp = Date.now();
    const randomSufix = Math.random().toString(36).substring(2, 8);
    const nombreSistemaFecha = `${nombreSinExtension}_${timestamp}_${randomSufix}.${extension}`;

    // 12. Convertir el archivo a Buffer
    const bytes = await archivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 13. CALCULAR HASH (para detectar duplicados por contenido)
    const hashe = createHash(hash).update(buffer).digest("hex");

    // 14. VERIFICAR SI EL ARCHIVO YA EXISTE EN CUALQUIER UBICACIÓN (por hash)
    const archivoDuplicado = await prisma.archivo.findUnique({
      where: { hash: hashe },
      select: {
        nombre: true,
        path: true,
        carpeta: {
          select: {
            nombre: true,
            estantes: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (archivoDuplicado) {
      const ubicacion = `${validaciones.nombreInstitucion} > ${validaciones.nombreDepartamento} > ${archivoDuplicado.carpeta.estantes[0].nombre} > ${archivoDuplicado.carpeta.nombre} > ${archivoDuplicado.nombre}`;
      return retornarRespuestaFunciones(
        "error",
        `Este archivo ya existe en el sistema. Ubicación original: ${ubicacion}`,
        {
          codigo: 409,
          hash_duplicado: hashe,
        },
      );
    }

    // 15. Verificar si la carpeta existe
    const datosCarpeta = await prisma.carpeta.findFirst({
      where: { id: validarCampos.id_carpeta },
      select: {
        codigo: true,
        nombre: true,
        id_estante: true,
        estante: { select: { codigo: true, nombre: true } },
      },
    });

    if (!datosCarpeta) {
      return retornarRespuestaFunciones(
        "error",
        "La carpeta especificada no existe",
        { codigo: 404 },
      );
    }
















    
    // 16. Generar código único del archivo
    const cantidadArchivos = await prisma.archivo.count();
    const numeroCodigo = String(cantidadArchivos + 1).padStart(10, "0");
    const codigoNuevo = `${datosCarpeta.codigo.toUpperCase()}-ARCH-${numeroCodigo}`;

    // 17. Verificar que el código no exista (por seguridad, aunque debería ser único)
    const archivoCodigoExistente = await prisma.archivo.findUnique({
      where: { codigo: codigoNuevo },
    });

    if (archivoCodigoExistente) {
      return retornarRespuestaFunciones(
        "error",
        "Error generando código único, intente nuevamente",
        { codigo: 500 },
      );
    }

    // 18. Verificar si el nombre del archivo ya existe en la misma carpeta
    const nombreRepetido = await prisma.archivo.findFirst({
      where: {
        id_carpeta: validarCampos.id_carpeta,
        nombre: validarCampos.nombre,
        borrado: false,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Ya existe un archivo con este nombre en la carpeta actual",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 409,
        },
      );
    }

    // 19. Verificar si el alias ya existe en la misma carpeta
    const aliasRepetido = await prisma.archivo.findFirst({
      where: {
        id_carpeta: validarCampos.id_carpeta,
        alias: validarCampos.alias,
        borrado: false,
      },
    });

    if (aliasRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Ya existe un archivo con este alias en la carpeta actual",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 409,
        },
      );
    }

    // 20. 🔒 Cifrar archivo
    const iv = randomBytes(16);
    const key = scryptSync(claveSecreta, "salt", 32);
    const cipher = createCipheriv(algoritmo, key, iv);
    const bufferCifrado = Buffer.concat([
      iv,
      cipher.update(buffer),
      cipher.final(),
    ]);

    // 21. Si todas las validaciones son correctas, retornar los datos para la creación
    return retornarRespuestaFunciones("ok", "Validación correcta", {
      id_usuario: validaciones.id_usuario,
      id_departamento: validaciones.id_departamento,
      id_estante: datosCarpeta.id_estante,
      id_carpeta: validarCampos.id_carpeta,
      nombre: validarCampos.nombre,
      nombreOriginal: nombreOriginal,
      nombreSistema: nombreSistemaFecha,
      hash: hashe,
      codigo: codigoNuevo,
      alias: validarCampos.alias,
      descripcion: validarCampos.descripcion,
      extension: extension,
      tipo: tipo.split("/")[0], // "image", "video", "application", etc.
      size: size,
      archivoCifrado: bufferCifrado,
      ultimaModificacion: ultimaModificacion,
      nombreInstitucion: validaciones.nombreInstitucion,
      nombreDepartamento: validaciones.nombreDepartamento,
      nombreEstante: datosCarpeta.estante.nombre,
      nombreCarpeta: datosCarpeta.nombre,
    });
  } catch (error) {
    // 22. Manejo de errores inesperados
    console.error("Error interno validar crear archivo:", error);

    return retornarRespuestaFunciones(
      "error",
      "Error interno en validación de archivo",
      { codigo: 500 },
    );
  }
}

// /**
//  @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
//  de creación de un archivo en la base de datos.
//  @module services/archivos/validarCrearArchivo
// */

// import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
// import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
// import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
// import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

// /**
//  Valida los campos y la lógica de negocio para crear una nueva carpeta.
//  @async
//  @function validarCrearArchivo
//  @param {string} nombre - El nombre de la nueva carpeta.
//  @param {string} descripcion - La descripción de la nueva carpeta.
//  @param {string} alias - El alias de la nueva carpeta.
// */

// const claveSecreta = process.env.CIFRADO_CLAVE;
// const algoritmo = process.env.CIFRADO_ALGORITMO;
// export default async function validarCrearArchivo(request) {
//   try {
//     // 1. Obtener y validar los datos del usuario a través del token.
//     const validaciones = await obtenerDatosUsuarioToken();

//     // 2. Si el token es inválido, se retorna un error.
//     if (validaciones.status === "error") {
//       return retornarRespuestaFunciones(
//         validaciones.status,
//         validaciones.message,
//       );
//     }

//     if (!claveSecreta || !algoritmo) {
//       return retornarRespuestaFunciones(
//         "error",
//         "Error variables de entorno de cifrado no configuradas",
//         {
//           id_usuario: validaciones.id_usuario,
//           codigo: 500,
//         },
//       );
//     }

//     const nombre = request.get("nombre");
//     const descripcion = request.get("descripcion");
//     const alias = request.get("alias");
//     const archivo = request.get("archivo");
//     const idCarpeta = request.get("idCarpeta");

//     // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
//     const validarCampos = ValidarCampos.validarCamposCrearArchivo(
//       idCarpeta,
//       nombre,
//       descripcion,
//       alias,
//     );

//     // 4. Si los campos no son válidos, se retorna un error.
//     if (validarCampos.status === "error") {
//       return retornarRespuestaFunciones(
//         validarCampos.status,
//         validarCampos.message,
//       );
//     }

//     // Extraer metadatos del archivo
//     const nombreOriginal = archivo.name;
//     const tipo = archivo.type;
//     const size = archivo.size;
//     const ultimaModificacion = new Date(archivo.lastModified).toLocaleString();

//     // Obtener extensión de forma segura
//     const extension = nombreOriginal.split(".").pop().toLowerCase();
//     const nombreSinExtension = nombreOriginal.substring(
//       0,
//       nombreOriginal.lastIndexOf("."),
//     );

//     // Generar un nombre con fecha y hora
//     const nombreSistemaFecha = `${nombreSinExtension}_${Date.now()}.${extension}`;

//     // Convertir el archivo en Buffer
//     const buffer = Buffer.from(await archivo.arrayBuffer());

//     // 🔒 Cifrar archivo antes de guardarlo
//     const iv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv(
//       algoritmo,
//       crypto.scryptSync(claveSecreta, "salt", 32),
//       iv,
//     );
//     const bufferCifrado = Buffer.concat([
//       iv,
//       cipher.update(buffer),
//       cipher.final(),
//     ]);

//     // Guardar el archivo cifrado en `public/uploads`
//     //fs.writeFileSync(rutaDestino, bufferCifrado);

//     const datosCarpeta = await prisma.carpeta.findFirst({
//       where: { id: validarCampos.id_carpeta },
//       select: { codigo: true, nombre: true },
//     });

//     const cantidadArchivos = await prisma.archivo.count();

//     const numeroCodigo = cantidadArchivos
//       ? String(cantidadArchivos).padStart(10, "0")
//       : "0000000000";

//     const codigoNuevo =
//       datosCarpeta.codigo.toUpperCase() + "-ARCH-" + numeroCodigo;

//     const archivoExistente = await prisma.archivo.findUnique({
//       where: { codigo: codigoNuevo, id_carpeta: validarCampos.id_carpeta },
//     });

//     if (archivoExistente) {
//       return retornarRespuestaFunciones(
//         "error",
//         "Error, otro archivo ya existe con el mismo código",
//         {
//           codigo: 409,
//         },
//       );
//     }

//     // 5. Verificar si el nombre de la archivo ya existe en la base de datos.
//     const nombreRepetido = await prisma.archivo.findFirst({
//       where: {
//         id_carpeta: validarCampos.id_carpeta,
//         nombre: validarCampos.nombre,
//       },
//     });

//     // 6. Si se encuentra una archivo con el mismo nombre, se retorna un error.
//     if (nombreRepetido) {
//       return retornarRespuestaFunciones(
//         "error",
//         "Error nombre de archivo repetido",
//         {
//           id_usuario: validaciones.id_usuario,
//           codigo: 409,
//         },
//       );
//     }

//     // 7. Verificar si el alias de la archivo ya existe en la base de datos.
//     const aliasRepetido = await prisma.archivo.findFirst({
//       where: {
//         id_carpeta: validarCampos.id_carpeta,
//         alias: validarCampos.alias,
//       },
//     });

//     // 8. Si se encuentra un archivo con el mismo alias, se retorna un error.
//     if (aliasRepetido) {
//       return retornarRespuestaFunciones(
//         "error",
//         "Error alias de archivo repetido",
//         {
//           id_usuario: validaciones.id_usuario,
//           codigo: 409,
//         },
//       );
//     }

//     // 15. Si todas las validaciones son correctas, se consolidan y retornan los datos para la creación.
//     return retornarRespuestaFunciones("ok", "Validacion correcta", {
//       id_usuario: validaciones.id_usuario,
//       nombre: validarCampos.nombre,
//       nombreOriginal: nombreOriginal,
//       nombreSistemaFecha: nombreSistemaFecha,
//       tipo: tipo,
//       size: size,
//       extension: extension,
//       ultimaModificacion: ultimaModificacion,
//       descripcion: validarCampos.descripcion,
//       alias: validarCampos.alias,
//       codigo: codigoNuevo,
//       archivoCifrado: bufferCifrado,
//       nombreInstitucion: validaciones.nombreInstitucion,
//       nombreDepartamento: validaciones.nombreDepartamento,
//       id_departamento: validaciones.id_departamento,
//       id_carpeta: validarCampos.id_carpeta,
//     });
//   } catch (error) {
//     // 16. Manejo de errores inesperados.
//     console.log(`Error interno validar crear archivo: ` + error);

//     // Retorna una respuesta del error inesperado
//     return retornarRespuestaFunciones(
//       "error",
//       "Error interno validar crear archivo",
//     );
//   }
// }
