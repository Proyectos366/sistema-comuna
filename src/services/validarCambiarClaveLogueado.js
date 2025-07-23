import ValidarCampos from "@/services/ValidarCampos";
import AuthTokens from "@/libs/AuthTokens";
import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import nombreToken from "@/utils/nombreToken";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import msjErrores from "../msj_validaciones/cambiar_clave/msjErrores.json";
import msjCorrectos from "../msj_validaciones/cambiar_clave/msjCorrectos.json";

export default async function validarCambiarClaveLogueado(
  claveVieja,
  claveUno,
  claveDos,
  token
) {
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

    const validandoCampos = ValidarCampos.validarCampoClave(claveUno, claveDos);

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const correo = descifrarToken.correo.toLowerCase();

    const claveUsuarioActivo = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: {
        clave: true,
        id: true,
      },
    });

    const comparada = await CifrarDescifrarClaves.compararClave(
      claveVieja,
      claveUsuarioActivo.clave
    );

    if (comparada.status === "error") {
      return retornarRespuestaFunciones(comparada.status, comparada.message);
    }

    // Encriptar clave
    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message
      );
    }

    return retornarRespuestaFunciones(
      msjCorrectos.ok,
      msjCorrectos.okCambioClave.encriptarCorrecto,
      {
        claveEncriptada: claveEncriptada.claveEncriptada,
        id_usuario: claveUsuarioActivo.id,
      }
    );
  } catch (error) {
    console.error(`${msjErrores.errorMixto}: ` + error);
    return retornarRespuestaFunciones(
      msjErrores.error,
      msjErrores.errorCambioClave.internoValidando
    );
  }
}
