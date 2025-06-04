import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import nombreToken from "@/utils/nombreToken";
import validarCambiarClaveLogueado from "@/services/validarCambiarClaveLogueado";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/cambiar_clave/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/cambiar_clave/msjCorrectos.json";

export async function POST(request) {
  try {
    const { claveVieja, claveUno, claveDos } = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const validaciones = await validarCambiarClaveLogueado(
      claveVieja,
      claveUno,
      claveDos,
      token
    );

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        msjErrores.codigo.codigo400
      );
    }

    const nuevoUsuario = await prisma.Usuario.update({
      where: { correo: validaciones.correo },
      data: { clave: validaciones.claveEncriptada },
    });

    if (!nuevoUsuario) {
      return generarRespuesta(
        msjErrores.error,
        msjErrores.errorCambioClave.cambioFallido,
        {},
        msjErrores.codigo.codigo400
      );
    } else {
      return generarRespuesta(
        msjCorrectos.ok,
        msjCorrectos.okCambioClave.cambioExitoso,
        {},
        msjCorrectos.codigo.codigo201
      );
    }
  } catch (error) {
    console.log(`${msjErrores.errorMixto}: ` + error);
    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorCambioClave.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
