import ValidarCampos from "@/services/ValidarCampos";
import AuthTokens from "@/libs/AuthTokens";
import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import nombreToken from "@/utils/nombreToken";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

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
    const correo = descifrarToken.correo.toLowerCase();

    const claveUsuarioActivo = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: {
        clave: true,
        id: true,
      },
    });

    if (!claveUsuarioActivo) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...", {
        id_usuario: 0,
      });
    }

    const validandoCampos = ValidarCampos.validarCampoClave(claveUno, claveDos);

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: claveUsuarioActivo.id,
        }
      );
    }

    const comparada = await CifrarDescifrarClaves.compararClave(
      claveVieja,
      claveUsuarioActivo.clave
    );

    if (comparada.status === "error") {
      return retornarRespuestaFunciones(comparada.status, comparada.message, {
        id_usuario: claveUsuarioActivo.id,
      });
    }

    // Encriptar clave
    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message,
        {
          id_usuario: claveUsuarioActivo.id,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion completa", {
      claveEncriptada: claveEncriptada.claveEncriptada,
      id_usuario: claveUsuarioActivo.id,
    });
  } catch (error) {
    console.error(`Error interno, validar clave loggeado: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error interno, validar clave loggeado"
    );
  }
}
