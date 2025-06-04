import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../msj_validaciones/login/msjErrores.json";
import msjCorrectos from "../../../msj_validaciones/login/msjCorrectos.json";
import nombreToken from "@/utils/nombreToken";

import validarInicioSesion from "@/services/validarInicioSesion";

export async function POST(req) {
  try {
    const { correo, clave } = await req.json();

    const validaciones = await validarInicioSesion(correo, clave);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        msjErrores.codigo.codigo400
      );
    }

    const response = NextResponse.json({
      status: msjCorrectos.ok,
      message: msjCorrectos.okLogin.iniciandoSesion,
      token: validaciones.token,
      redirect: validaciones.redirect,
    });

    response.cookies.set(
      nombreToken,
      validaciones.token,
      validaciones.cookieOption
    );
    return response;
  } catch (error) {
    console.error(`${msjErrores.errorLogin.internoValidando}: ` + error);
    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorLogin.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies(); // Esperar la llamada a cookies()

    // Eliminar la cookie directamente usando cookieStore
    cookieStore.delete(nombreToken);

    return generarRespuesta(
      msjCorrectos.ok,
      msjCorrectos.okLogin.cerrandoSesion,
      {},
      msjCorrectos.codigo.codigo201
    );
  } catch (error) {
    console.error("Error, cerrando sesión:", error);
    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorLogin.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
