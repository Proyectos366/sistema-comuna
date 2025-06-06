import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(req) {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { searchParams } = new URL(req.url);
    const idParroquia = searchParams.get("idParroquia");

    const id_parroquia = Number(idParroquia);

    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    if (!idParroquia) {
      return generarRespuesta(
        "error",
        "El ID de parroquia es obligatorio.",
        {},
        400
      );
    }

    // Consultar los consejos comunales de la comuna específica
    const circuitos = await prisma.circuito.findMany({
      where: {
        id_parroquia: id_parroquia,
        borrado: false,
        validado: false,
      },
    });

    if (!circuitos) {
      return generarRespuesta(
        "ok",
        "No hay circuitos en esta parroquia.",
        { circuitos: [] },
        200
      );
    }

    return generarRespuesta(
      "ok",
      "Circuitos encontrados.",
      { circuitos: circuitos },
      200
    );
  } catch (error) {
    console.log(`Error interno al consultar circuitos: ${error}`);

    return generarRespuesta(
      "error",
      "Error interno al consultar circuitos.",
      {},
      500
    );
  }
}
