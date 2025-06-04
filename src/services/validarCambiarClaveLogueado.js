import ValidarCampos from "@/services/ValidarCampos";
import AuthTokens from "@/libs/AuthTokens";
import prisma from "@/libs/prisma";
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
    // Validar campos
    const validandoCampos = ValidarCampos.validarCampoClave(claveUno, claveDos);

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    const correo = descifrarToken.correo;

    const claveUsuarioActivo = await prisma.Usuario.findFirst({
      where: { correo: correo },
      select: {
        clave: true,
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
        correo: correo,
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
