import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(req) {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { searchParams } = new URL(req.url);
    const idCircuito = searchParams.get("idCircuito");

    const id_circuito = Number(idCircuito);

    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    if (!idCircuito) {
      return generarRespuesta(
        "error",
        "El ID de circuito comunal es obligatorio.",
        {},
        400
      );
    }

    // Consultar los consejos comunales de la comuna específica
    const vocerosPorCircuitoComunal = await prisma.vocero.findMany({
      where: {
        id_circuito: id_circuito,
        id_consejo: null, // Solo traer registros donde id_consejo es NULL
      },
      include: {
        cargos: true, // Incluir los cargos relacionados
      },
    });

    if (!vocerosPorCircuitoComunal) {
      return generarRespuesta(
        "ok",
        "No hay voceros en este circuito comunal.",
        { voceros: [] },
        200
      );
    }

    return generarRespuesta(
      "ok",
      "Voceros encontrados.",
      { voceros: vocerosPorCircuitoComunal },
      200
    );
  } catch (error) {
    console.log(`Error, interno al consultar voceros circuito: ${error}`);

    return generarRespuesta(
      "error",
      "Error, interno al consultar voceros circuito...",
      {},
      500
    );
  }
}
