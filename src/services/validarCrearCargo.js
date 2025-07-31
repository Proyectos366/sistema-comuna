import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "./ValidarCampos";

export default async function validarCrearCargo(nombre, descripcion) {
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

    const validarCampos = ValidarCampos.validarCamposCrearCargo(
      nombre,
      descripcion
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    const correo = descifrarToken.correo;

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!idUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    const nombreRepetido = await prisma.cargo.findFirst({
      where: {
        nombre: validarCampos.nombre,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, cargo ya existe...", {
        id_usuario: idUsuario.id,
      });
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: idUsuario.id,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
    });
  } catch (error) {
    console.log(`Error, interno al crear cargo: ` + error);
    return retornarRespuestaFunciones("error", "Error, interno al crear cargo");
  }
}
