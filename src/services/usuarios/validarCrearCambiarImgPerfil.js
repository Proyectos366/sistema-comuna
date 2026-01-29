/**
 @fileoverview Función utilitaria para validar la identidad del usuario y procesar
 la carga o actualización de su imagen de perfil, incluyendo almacenamiento local.
 @module services/usuarios/validarCrearCambiarImgPerfil
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import { writeFile, mkdir } from "fs/promises"; // Funciones para escribir archivos y crear directorios
import path from "path"; // Utilidad para manejar rutas de archivos
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación
import { extensionArchivoRegex } from "@/utils/regex/extensionArchivoRegex";

/**
 Valida la identidad del usuario y procesa la imagen de perfil enviada.
 Guarda la imagen en el sistema de archivos y retorna metadatos relevantes.
 @async
 @function validarCrearCambiarImgPerfil
 @param {Request} request - Objeto de solicitud que contiene la imagen en formato FormData.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarCrearCambiarImgPerfil(request) {
  try {
    // 1. Validar identidad del usuario mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Extraer la imagen desde el formulario.
    const imagen = (await request.formData()).get("imagen");

    // 4. Validar que se haya recibido una imagen.
    if (!imagen) {
      return retornarRespuestaFunciones(
        "error",
        "Error, imagen vacía",
        {},
        400,
      );
    }

    // 5. Extraer metadatos de la imagen.
    const {
      name: nombreOriginalImagen,
      type: tipoImagen,
      size: sizeImagen,
      lastModified,
    } = imagen;

    // 6. Extracción y transformación de metadatos de la imagen
    const extensionImagen =
      nombreOriginalImagen.split(".").pop()?.toLowerCase() || "";
    const nombreSinExtension = nombreOriginalImagen.replace(
      extensionArchivoRegex,
      "",
    );
    const nombreSistemaFecha = `${nombreSinExtension}_${Date.now()}.${extensionImagen}`;

    // 7. Conversión de fecha de modificación
    const fecha = new Date(lastModified);
    const ultimaModificacionImagen = fecha.toISOString();

    // 8. Conversión de la imagen a buffer
    const buffer = Buffer.from(await imagen.arrayBuffer());

    // 9. Construcción de ruta de almacenamiento
    const nombreCarpetaUsuario = `${validaciones.nombre}${validaciones.cedula}`;
    const rutaUsuario = path.join(
      process.cwd(),
      "storage",
      "uploads",
      "img-perfil",
      nombreCarpetaUsuario,
    );

    // 10. Creación de carpeta si no existe
    await mkdir(rutaUsuario, { recursive: true });

    // 11. Definición de rutas finales
    const rutaRelativa = `/uploads/img-perfil/${nombreCarpetaUsuario}/${nombreSistemaFecha}`;
    const rutaFinal = path.join(rutaUsuario, nombreSistemaFecha);

    // 12. Escritura del archivo en disco
    await writeFile(rutaFinal, buffer);

    // 13. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      nombreOriginal: nombreOriginalImagen,
      nombreSistema: nombreSistemaFecha,
      tipoImagen: tipoImagen,
      sizeImagen: Number(sizeImagen),
      ultimaModificacionImagen: ultimaModificacionImagen,
      extensionImagen: extensionImagen,
      nombreSinExtension: nombreSinExtension,
      rutaDestino: rutaUsuario,
      path: rutaRelativa,
      id_usuario: validaciones.id_usuario,
      usuarioAntes: validaciones,
    });
  } catch (error) {
    // 14. Manejo de errores inesperados.
    console.log("Error interno validar subir imagen de perfil: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar subir imagen de perfil",
    );
  }
}
