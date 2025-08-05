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
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
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

    if (!datosUsuarioPerfil) {
      return generarRespuesta("error", "Error, usuario no existe...", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Exito, usuario encontrado",
        {
          usuarioPerfil: datosUsuarioPerfil,
        },
        200
      );
    }
  } catch (error) {
    console.log("Error interno, usuario perfil" + error);

    return generarRespuesta(
      "error",
      "Error interno, usuario perfil...",
      {},
      500
    );
  }
}
