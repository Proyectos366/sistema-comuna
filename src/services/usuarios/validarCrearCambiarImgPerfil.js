import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearCambiarImgPerfil(request) {
  try {
    const token = (await cookies()).get(nombreToken)?.value;
    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    const { correo } = descifrarToken;

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        correo: true,
        id_rol: true,
        borrado: true,
        validado: true,
        clave: true,
        createdAt: true,
        MiembrosDepartamentos: {
          select: {
            id: true,
            nombre: true,
          },
        },
        imagenes: {
          orderBy: {
            createdAt: "desc", // Más reciente primero
          },
          take: 1, // Solo la última imagen
          select: {
            id: true,
            path: true,
          },
        },
        roles: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario inválido...");
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

    const nombreCarpetaUsuario = `${datosUsuario.nombre}${datosUsuario.cedula}`;

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
      id_usuario: datosUsuario.id,
      usuarioAntes: datosUsuario,
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
