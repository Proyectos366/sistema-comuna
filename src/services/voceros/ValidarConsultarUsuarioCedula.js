import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import { quitarCaracteres } from "@/utils/quitarCaracteres";

export default async function validarConsultarVoceroCedula(cedula) {
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

    if (!cedula) {
      return retornarRespuestaFunciones("error", "Campo cedula vacio...");
    }

    const cedulaLimpia = quitarCaracteres(cedula);
    const cedulaNumero = Number(cedulaLimpia);

    const correo = descifrarToken.correo;

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      cedula: cedulaNumero,
    });
  } catch (error) {
    console.log(`Error, interno usuario cedula: ` + error);
    return retornarRespuestaFunciones("error", "Error, interno usuario cedula");
  }
}
