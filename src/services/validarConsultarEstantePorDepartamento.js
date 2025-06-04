import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import msjErrores from "../msj_validaciones/estante/msjErrores.json";
import msjCorrectos from "../msj_validaciones/estante/msjCorrectos.json";

export default async function validarConsultarEstantePorDepartamento() {
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

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true, id_rol: true },
    });

    return retornarRespuestaFunciones(
      msjCorrectos.ok,
      msjCorrectos.okConsultarEstantesPorDepartamento.estantesEncontrados,
      {
        id_usuario: idUsuario.id,
        id_rol: idUsuario.id_rol,
        correo: correo,
      }
    );
  } catch (error) {
    console.error(
      `${msjErrores.errorConsultarEstantePorDepartamento.internoValidando}: ` +
        error
    );
    return retornarRespuestaFunciones(
      msjErrores.error,
      msjErrores.errorConsultarEstantePorDepartamento.internoValidando
    );
  }
}
