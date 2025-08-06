import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarCrearModulo(nombre) {
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

    const correo = descifrarToken.correo;
    const nombreMayuscula = nombre.toUpperCase();

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    return retornarRespuestaFunciones(
      'ok',
      'Validacion correcta',
      {
        id_usuario: idUsuario.id,
        nombre: nombreMayuscula,
      }
    );
  } catch (error) {
    console.log(`Error, interno al crear modulo: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear modulo"
    );
  }
}
