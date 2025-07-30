import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "@/services/ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarComuna(
  nombre,
  id_parroquia,
  id_comuna
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

    const correoUsuarioActivo = descifrarToken.correo;

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correoUsuarioActivo },
      select: {
        id: true,
      },
    });

    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposEditarComuna(
      nombre,
      id_parroquia,
      id_comuna
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: idUsuario.id,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      id_usuario: idUsuario.id,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
    });
  } catch (error) {
    console.log(`Error, interno al editar comuna: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar comuna..."
    );
  }
}
