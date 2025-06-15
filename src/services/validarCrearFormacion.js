import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "./ValidarCampos";

export default async function validarCrearFormacion(nombre, modulos) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    const validarCampos = ValidarCampos.validarCamposCrearFormacion(
      nombre,
      modulos
    );
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    const correo = descifrarToken.correo;
    const nombreMayuscula = nombre.toUpperCase();

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!idUsuario) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no encontrado..."
      );
    }

    const todosModulos = await prisma.modulo.findMany({
      where: { borrado: false },
      select: { id: true },
      take: modulos,
      orderBy: {
        id: "asc",
      },
    });

    if (!todosModulos || todosModulos.length === 0) {
      return retornarRespuestaFunciones("error", "Error, no hay modulos...");
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: idUsuario.id,
      nombre: nombreMayuscula,
      modulos: todosModulos,
    });
  } catch (error) {
    console.log(`Error, interno al validar crear formacion: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al validar crear formacion"
    );
  }
}
