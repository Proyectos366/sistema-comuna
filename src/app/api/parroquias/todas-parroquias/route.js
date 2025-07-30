import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodasParroquias from "@/services/validarConsultarTodasParroquias";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodasParroquias();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todasParroquias = await prisma.parroquia.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todasParroquias) {
      return generarRespuesta(
        "error",
        "Error, al consultar parroquias...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas las parroquias...",
        {
          parroquias: todasParroquias,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (parroquias): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (parroquias)",
      {},
      500
    );
  }
}
