import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "./ValidarCampos";

export default async function validarCrearCargo(nombre) {
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

    const validarNombre = ValidarCampos.validarCampoNombre(nombre);

    if (validarNombre.status === "error") {
      return retornarRespuestaFunciones(
        validarNombre.status,
        validarNombre.message
      );
    }

    const correo = descifrarToken.correo;
    const nombreMinuscula = nombre.toLowerCase();

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    const nombreRepetido = await prisma.cargo.findFirst({
      where: {
        nombre: nombre,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, cargo ya existe...");
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: idUsuario.id,
      nombre: nombreMinuscula,
    });
  } catch (error) {
    console.log(`Error, interno al crear cargo: ` + error);
    return retornarRespuestaFunciones("error", "Error, interno al crear cargo");
  }
}
