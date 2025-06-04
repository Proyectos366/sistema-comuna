import prisma from "@/libs/prisma";
import AuthTokens from "@/libs/AuthTokens";
import { cookies } from "next/headers";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/consultar_usuario_activo/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/consultar_usuario_activo/msjCorrectos.json";
import nombreToken from "@/utils/nombreToken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return generarRespuesta(
        descifrarToken.status,
        descifrarToken.message,
        {},
        msjErrores.codigo.codigo400
      );
    }

    const correo = descifrarToken.correo;

    const datosUsuarioActivo = await prisma.usuario.findFirst({
      where: { correo: correo },
    });

    if (!datosUsuarioActivo) {
      return generarRespuesta(
        msjErrores.error,
        msjErrores.errorConsultarUsuarioActivo.usuarioNoEncontrado,
        {},
        msjErrores.codigo.codigo400
      );
    } else {
      return generarRespuesta(
        msjCorrectos.ok,
        msjCorrectos.okConsultarUsuarioActivo.usuarioEncontrado,
        { usuarioActivo: datosUsuarioActivo },
        msjCorrectos.codigo.codigo200
      );
    }
  } catch (error) {
    console.log(`${msjErrores.errorMixto}: ` + error);
    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorConsultarUsuarioActivo.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
