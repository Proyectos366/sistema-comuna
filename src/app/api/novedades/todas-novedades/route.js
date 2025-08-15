import prisma from "@/libs/prisma";
import validarConsultarTodasNovedades from "@/services/novedades/validarConsultarTodasNovedades";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodasNovedades();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todasNovedades = await prisma.novedad.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todasNovedades) {
      return generarRespuesta(
        "error",
        "Error, al consultar novedades...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas las novedades...",
        {
          novedades: todasNovedades,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (novedades): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (novedades)",
      {},
      500
    );
  }
}
