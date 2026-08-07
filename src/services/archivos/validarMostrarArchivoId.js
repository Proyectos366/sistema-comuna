/**
 @fileoverview Función utilitaria para validar el ID de un archivo antes de mostrarlo. Esta función comprueba
 el token del usuario, valida el ID y prepara los datos para mostrar el archivo.
 @module services/archivos/validarMostrarArchivoId
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

export default async function validarMostrarArchivoId(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idArchivo = searchParams.get("idArchivo");

    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    const validarIdArchivo = ValidarCampos.validarCampoId(idArchivo, "archivo");

    if (validarIdArchivo.status === "error") {
      return retornarRespuestaFunciones(
        validarIdArchivo.status,
        validarIdArchivo.message,
        { codigo: 400 },
      );
    }

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

    if (
      validaciones.id_rol > 2 &&
      archivo.id_departamento !== validaciones.id_departamento
    ) {
      return retornarRespuestaFunciones("error", "Acceso denegado", {
        id_usuario: validaciones.id_usuario,
        codigo: 403,
      });
    }

    // 1. Definir directorio base absoluto sin enlaces simbólicos
    let BASE_DIR = path.resolve(process.cwd(), "storage", "instituciones");

    if (fs.existsSync(BASE_DIR)) {
      BASE_DIR = fs.realpathSync(BASE_DIR);
    }

    // 2. Normalizar ruta limpiando barras iniciales para evitar concatenación defectuosa o mutilación de caracteres
    const pathLimpio = archivo.path.replace(/\\/g, "/").replace(/^\/+/, "");

    // Si el path de la BD incluye "storage/instituciones/", extraemos solo la parte relativa
    const parteRelativa = pathLimpio.replace(/^storage\/instituciones\//i, "");

    // 3. Resolver la ruta absoluta en disco
    let fullPath = path.resolve(BASE_DIR, parteRelativa);

    // 4. Si el archivo existe físicamente, obtener su ruta real resuelta
    if (fs.existsSync(fullPath)) {
      fullPath = fs.realpathSync(fullPath);
    }

    // 5. Control de seguridad contra Path Traversal
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

    // 6. Verificar existencia física antes de llamar statSync (previene error 500 ENOENT)
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

    // 7. Leer y desencriptar
    const bufferEncriptado = fs.readFileSync(fullPath);
    const bufferDesencriptado = CifrarDescifrarArchivo.desencriptarArchivo(
      bufferEncriptado,
      claveSecreta,
      algoritmo,
    );

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
    const contentDisposition = `attachment; filename="${filename.replace(/"/g, '\\"')}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_archivo: validarIdArchivo.id,
      bufferDesencriptado,
      mimeType,
      contentDisposition,
    });
  } catch (error) {
    console.log("Error interno validar id archivo mostrar: ", error);
    
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar id archivo mostrar",
    );
  }
}
