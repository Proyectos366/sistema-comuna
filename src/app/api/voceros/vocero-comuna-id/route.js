import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(req) {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { searchParams } = new URL(req.url);
    const idComuna = searchParams.get("idComuna");

    const id_comuna = Number(idComuna);

    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    if (!idComuna) {
      return generarRespuesta(
        "error",
        "El ID de comuna es obligatorio.",
        {},
        400
      );
    }

    // Consultar los consejos comunales de la comuna específica
    const vocerosPorComuna = await prisma.vocero.findMany({
      where: { id_comuna: id_comuna },
      include: {
        cargos: true, // Incluir los cargos relacionados
      },
    });

    if (!vocerosPorComuna) {
      return generarRespuesta(
        "ok",
        "No hay voceros en esta comuna...",
        { voceros: [] },
        200
      );
    }

    return generarRespuesta(
      "ok",
      "Voceros encontrados.",
      { voceros: vocerosPorComuna },
      200
    );
  } catch (error) {
    console.log(`Error, interno al consultar voceros comuna: ${error}`);

    return generarRespuesta(
      "error",
      "Error, interno al consultar voceros comuna...",
      {},
      500
    );
  }
}
