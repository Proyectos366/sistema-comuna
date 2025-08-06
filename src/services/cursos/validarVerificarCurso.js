import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";

export default async function validarVerificarCurso(id_curso, id_vocero) {
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

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    const validarIdCurso = ValidarCampos.validarCampoId(id_curso);
    const validarIdVocero = ValidarCampos.validarCampoId(id_vocero);

    if (validarIdCurso.status === "error") {
      return retornarRespuestaFunciones(
        validarIdCurso.status,
        validarIdCurso.message
      );
    }

    if (validarIdVocero.status === "error") {
      return retornarRespuestaFunciones(
        validarIdVocero.status,
        validarIdVocero.message
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      id_curso: validarIdCurso.id,
      id_vocero: validarIdVocero.id,
    });
  } catch (error) {
    console.log(`Error, interno al validar curso: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al validar curso"
    );
  }
}
