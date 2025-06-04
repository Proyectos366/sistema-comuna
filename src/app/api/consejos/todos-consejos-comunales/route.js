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

    const todasComunas = await prisma.comuna.findMany();

    if (!todasComunas) {
      return generarRespuesta(
        "error",
        "Error, al consultar comunas...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas las comunas...",
        {
          comunas: todasComunas,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (comunas): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (comunas)",
      {},
      500
    );
  }
}
