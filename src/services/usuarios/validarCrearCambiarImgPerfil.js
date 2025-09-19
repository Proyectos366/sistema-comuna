import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearCambiarImgPerfil(request) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const imagen = (await request.formData()).get("imagen");

    if (!imagen) {
      return retornarRespuestaFunciones(
        "error",
        "Error, imagen vacía...",
        {},
        400
      );
    }

    const {
      name: nombreOriginalImagen,
      type: tipoImagen,
      size: sizeImagen,
      lastModified,
    } = imagen;

    const extensionImagen =
      nombreOriginalImagen.split(".").pop()?.toLowerCase() || "";
    const nombreSinExtension = nombreOriginalImagen.replace(/\.[^/.]+$/, "");
    const nombreSistemaFecha = `${nombreSinExtension}_${Date.now()}.${extensionImagen}`;

    const fecha = new Date(lastModified);

    const ultimaModificacionImagen = fecha.toISOString();

    const buffer = Buffer.from(await imagen.arrayBuffer());

    const nombreCarpetaUsuario = `${validaciones.nombre}${validaciones.cedula}`;

    const rutaUsuario = path.join(
      process.cwd(),
      "storage",
      "uploads",
      "img-perfil",
      nombreCarpetaUsuario
    );

    await mkdir(rutaUsuario, { recursive: true });

    const rutaRelativa = `/uploads/img-perfil/${nombreCarpetaUsuario}/${nombreSistemaFecha}`;

    const rutaFinal = path.join(rutaUsuario, nombreSistemaFecha);
    await writeFile(rutaFinal, buffer);

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
      id_usuario: validaciones.id,
      usuarioAntes: validaciones,
    });
  } catch (error) {
    console.log("Error interno validar subir imagen de perfil: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar subir imagen de perfil"
    );
  }
}
