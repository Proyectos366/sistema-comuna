/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de un archivo en la base de datos.
 @module services/archivos/validarCrearArchivo
*/

import { createHash } from "crypto";
import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "@/services/ValidarCampos";
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken";
import path from "path";
import fs from "fs";
import CifrarDescifrarArchivo from "@/libs/CifrarDescifrarArchivo";
import { generarCodigoSecuencial } from "@/utils/codigo/codigoSecuencial";
import procesarFormDataArchivo from "./validarExtraerDatosArchivo";

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

    // 4. Extraer datos de la request (formData) y procesarlos
    const {
      nombre,
      descripcion,
      alias,
      archivo,
      idCarpeta,
      nombreOriginal,
      tipo,
      size,
      ultimaModificacion,
      extension,
      nombreSistemaFecha,
    } = await procesarFormDataArchivo(request);

    // 5. Validar que el archivo exista
    if (!archivo || archivo.size === 0) {
      return retornarRespuestaFunciones(
        "error",
        "No se ha proporcionado ningún archivo",
        { codigo: 400 },
      );
    }

    // 6. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validarCampos = ValidarCampos.validarCamposCrearArchivo(
      idCarpeta,
      nombre,
      descripcion,
      alias,
    );

    // 7. Si los campos no son válidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
      );
    }

    // 8. Convertir el archivo a Buffer
    const bytes = await archivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 9. Calcular hash (para detectar duplicados por contenido)
    const hashe = createHash(hash).update(buffer).digest("hex");

    // 10. Verificar si el archivo ya esta en cualquier ubicacion del sistema (por hash)
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

    // 11. Si se encuentra un archivo con el mismo hash, se retorna un error.
    if (archivoDuplicado) {
      return retornarRespuestaFunciones(
        "error",
        `Este archivo ya existe en el sistema`,
        {
          codigo: 409,
          hash_duplicado: hashe,
        },
      );
    }

    // 12. Consultar la carpeta por id
    const datosCarpeta = await prisma.carpeta.findFirst({
      where: { id: validarCampos.id_carpeta },
      select: {
        codigo: true,
        nombre: true,
        alias: true,
        id_estante: true,
        path: true,
        estantes: { select: { codigo: true, nombre: true, alias: true } },
      },
    });

    // 13. Verificar si la carpeta no existe, retornar un error
    if (!datosCarpeta) {
      return retornarRespuestaFunciones(
        "error",
        "La carpeta especificada no existe",
        { codigo: 404 },
      );
    }

    // 14. Verificar si el nombre del archivo ya existe, retornar un error
    const nombreRepetido = await prisma.archivo.findFirst({
      where: {
        id_carpeta: validarCampos.id_carpeta,
        nombre: validarCampos.nombre,
        borrado: false,
      },
    });

    // 15. Verificar si el nombre ya existe, retornar un error
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Ya existe un archivo con este nombre",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 409,
        },
      );
    }

    // 16. Verificar si el alias del archivo ya existe, retornar un error
    const aliasRepetido = await prisma.archivo.findFirst({
      where: {
        id_carpeta: validarCampos.id_carpeta,
        alias: validarCampos.alias,
        borrado: false,
      },
    });

    // 17. Verificar si el alias ya existe, retornar un error
    if (aliasRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Ya existe un archivo con este alias",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 409,
        },
      );
    }

    // 18. 🔒 Cifrar archivo
    const bufferCifrado = CifrarDescifrarArchivo.cifrarArchivo(
      buffer,
      claveSecreta,
      algoritmo,
    );

    // 19. Guardar archivo cifrado en carpeta temporal
    const tempDir = path.join(process.cwd(), "storage", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const rutaTemporal = path.join(tempDir, nombreSistemaFecha);
    fs.writeFileSync(rutaTemporal, bufferCifrado);

    // 20. Consultar cantidad de archivos para generar el código
    const cantidadArchivos = await prisma.archivo.count({
      where: {
        id_carpeta: validarCampos.id_carpeta,
      },
    });

    // 21. Generar código único del archivo
    const codigoArchivo = generarCodigoSecuencial(
      datosCarpeta.codigo,
      "ARCH",
      cantidadArchivos,
    );

    // 22. Consultar si existe un archivo con el mismo codigo
    const archivoCodigoExistente = await prisma.archivo.findUnique({
      where: { codigo: codigoArchivo },
    });

    // 23. Verificar si el codigo ya existe, retornar un error
    if (archivoCodigoExistente) {
      return retornarRespuestaFunciones(
        "error",
        "Error generando código único, intente nuevamente",
        { codigo: 409 },
      );
    }

    // 24. Ruta al archivo
    const pathArchivo = datosCarpeta.path;

    // 25. Si todas las validaciones son correctas, retornar los datos para la creación
    return retornarRespuestaFunciones("ok", "Validación correcta", {
      id_usuario: validaciones.id_usuario,
      id_departamento: validaciones.id_departamento,
      id_estante: datosCarpeta.id_estante,
      id_carpeta: validarCampos.id_carpeta,
      nombre: validarCampos.nombre,
      nombreOriginal: nombreOriginal.toLowerCase(),
      nombreSistema: nombreSistemaFecha.toLowerCase(),
      hash: hashe,
      codigo: codigoArchivo.toLowerCase(),
      alias: validarCampos.alias,
      descripcion: validarCampos.descripcion,
      extension: extension.toLowerCase(),
      tipo: tipo.split("/")[0], // "image", "video", "application", etc.
      size: size,
      archivoCifrado: bufferCifrado,
      ultimaModificacion: ultimaModificacion,
      nombreInstitucion: validaciones.nombreInstitucion,
      nombreDepartamento: validaciones.nombreDepartamento,
      nombreEstante: datosCarpeta.estantes.nombre,
      aliasEstante: datosCarpeta.estantes.alias,
      nombreCarpeta: datosCarpeta.nombre,
      aliasCarpeta: datosCarpeta.alias,
      rutaTemporal: rutaTemporal,
      path: pathArchivo.toLowerCase(),
    });
  } catch (error) {
    // 26. Manejo de errores inesperados
    console.log("Error interno validar crear archivo:", error);

    return retornarRespuestaFunciones(
      "error",
      "Error interno en validación de archivo",
    );
  }
}

// 4. Obtener formData del request (App Router)
// const formData = await request.formData();

// // 5. Extraer campos del formData
// const nombre = formData.get("nombre");
// const descripcion = formData.get("descripcion");
// const alias = formData.get("alias");
// const archivo = formData.get("archivo");
// const idCarpeta = formData.get("idCarpeta");

// // 9. Extraer metadatos del archivo
// const nombreOriginal = archivo.name;
// const tipo = archivo.type;
// const size = archivo.size;
// const ultimaModificacion = new Date(archivo.lastModified);
// //const ultimaModificacion = new Date(archivo.lastModified).toLocaleString();

// // 10. Obtener extensión de forma segura
// const extension = nombreOriginal.split(".").pop()?.toLowerCase();

// const nombreSinExtension = nombreOriginal.substring(
//   0,
//   nombreOriginal.lastIndexOf("."),
// );

// // 11. Generar nombre de sistema con fecha y hora + hash corto para evitar colisiones
// const timestamp = Date.now();
// const randomSufix = Math.random().toString(36).substring(2, 8);
// const nombreSistemaFecha = `${nombreSinExtension}_${timestamp}_${randomSufix}.${extension}`;
