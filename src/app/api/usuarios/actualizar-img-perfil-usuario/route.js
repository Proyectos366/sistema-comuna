import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";

import { NextResponse } from "next/server";
import validarCrearCambiarImgPerfil from "@/services/usuarios/validarCrearCambiarImgPerfil";

export async function POST(request) {
  try {
    const validaciones = await validarCrearCambiarImgPerfil(request);
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_IMG_PERFIL",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al intentar actualizar la imagen de perfil",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const [cambiarImgPerfil, usuarioActualizado] = await prisma.$transaction([
      prisma.imagen.create({
        data: {
          nombreOriginal: validaciones.nombreOriginal,
          nombreSistema: validaciones.nombreSistema,
          path: validaciones.path,
          tipo: validaciones.tipoImagen,
          formato: validaciones.extensionImagen,
          peso: validaciones.sizeImagen,
          id_usuario: validaciones.id_usuario,
        },
      }),

      prisma.usuario.findUnique({
        where: { id: validaciones.id_usuario },
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
      }),
    ]);

    if (!usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_IMAGEN_PERFIL",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la imagen de perfil",
        datosAntes: null,
        datosDespues: usuarioActualizado,
      });

      return generarRespuesta(
        "error",
        "No se actualizo la imagen de perfil",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "UPDATE_IMAGEN_PERFIL",
        id_objeto: usuarioActualizado.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `La imagen del perfil se actualizo con exito...`,
        datosAntes: validaciones.usuarioAntes,
        datosDespues: usuarioActualizado,
      });

      return generarRespuesta(
        "ok",
        "Se actualizo la imagen de perfil...",
        { usuarioPerfil: usuarioActualizado },
        200
      );
    }
  } catch (error) {
    console.error("Error interno al actualizar imagen de perfil:", error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_IMAGEN_PERFIL",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la imagen de perfil",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno al actualizar imagen de perfil...",
      {},
      500
    );
  }
}
