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

    const comunas = await prisma.comuna.findMany({
      where: { id_parroquia: id_parroquia, borrado: false },
      include: {
        voceros: {
          select: {
            id: true,
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            cedula: true,
            telefono: true,
            correo: true,
            edad: true,
            genero: true,
          },
        },
      },
    });

    if (!comunas) {
      return generarRespuesta(
        "ok",
        "No hay comunas en esta parroquia.",
        { comunas: [] },
        200
      );
    }

    return generarRespuesta(
      "ok",
      "Comunas encontradas.",
      { comunas: comunas },
      200
    );
  } catch (error) {
    console.log(`Error interno al consultar comunas: ${error}`);

    return generarRespuesta(
      "error",
      "Error interno al consultar comunas.",
      {},
      500
    );
  }
}
