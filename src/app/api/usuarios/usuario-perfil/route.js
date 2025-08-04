import prisma from "@/libs/prisma";
import AuthTokens from "@/libs/AuthTokens";
import { cookies } from "next/headers";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import nombreToken from "@/utils/nombreToken";
import registrarEventoSeguro from "@/libs/trigget";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_USUARIO_PERFIL",
        id_objeto: 0,
        id_usuario: 0,
        descripcion:
          "Token invalido para consultar los datos de usuario para el perfil",
        datosAntes: null,
        datosDespues: descifrarToken,
      });

      return generarRespuesta(
        descifrarToken.status,
        descifrarToken.message,
        {},
        400
      );
    }

    const correo = descifrarToken.correo;

    const datosUsuarioPerfil = await prisma.usuario.findFirst({
      where: { correo: correo },
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
          select: {
            id: true,
            path: true,
          },
        },
      },
    });

    if (!datosUsuarioPerfil) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_GET_DATOS_USUARIO_PERFIL",
        id_objeto: 0,
        id_usuario: 0,
        descripcion:
          "No se pudo obtener los datos del usuario para mostar el perfil",
        datosAntes: null,
        datosDespues: null,
      });

      return generarRespuesta("error", "Error, usuario no existe...", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "GET_DATOS_USUARIO_PERFIL",
        id_objeto: 0,
        id_usuario: datosUsuarioPerfil.id,
        descripcion: "Se obtuvieron los datos para el perfil de usuario",
        datosAntes: null,
        datosDespues: {
          datosUsuarioPerfil,
        },
      });

      return generarRespuesta(
        "ok",
        "Exito, usuario encontrado",
        {
          usuarioPerfil: datosUsuarioPerfil,
          departamento:
            datosUsuarioPerfil?.MiembrosDepartamentos &&
            datosUsuarioPerfil.MiembrosDepartamentos.length > 0
              ? datosUsuarioPerfil.MiembrosDepartamentos[0]
              : null,
          departamento:
            datosUsuarioPerfil?.imagenes &&
            datosUsuarioPerfil.imagenes.length > 0
              ? datosUsuarioPerfil.imagenes[0]
              : null,
        },
        200
      );
    }
  } catch (error) {
    console.log("Error interno, usuario perfil" + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_USUARIO_PERFIL",
      id_objeto: 0,
      id_usuario: 0,
      descripcion:
        "Error inesperado al consultar los datos de usuario para ver el perfil",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error interno, usuario perfil...",
      {},
      500
    );
  }
}
