import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";

export default async function validarConsultarConsejoIdCircuito(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idCircuito = searchParams.get("idCircuito");

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

    const id_circuito = ValidarCampos.validarCampoId(idCircuito);

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      correo: correo,
      id_circuito: id_circuito.id,
    });
  } catch (error) {
    console.log(
      `Error, interno validar consultar consejo id_circuito: ` + error
    );
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar consultar consejo id_circuito"
    );
  }
}
