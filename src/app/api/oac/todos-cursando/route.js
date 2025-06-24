import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
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

    const todosCursando = await prisma.cursando.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todosCursando) {
      return generarRespuesta(
        "error",
        "Error, al consultar cursandos...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todos los cursandos...",
        {
          cursandos: todosCursando,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (cursandos): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (cursandos)",
      {},
      500
    );
  }
}
