import prisma from "@/libs/prisma";
import validarConsultarTodasInstituciones from "@/services/instituciones/validarConsultarTodasInstituciones";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodasInstituciones();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todasInstituciones = await prisma.institucion.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todasInstituciones) {
      return generarRespuesta(
        "error",
        "Error, al consultar todas las instituciones...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas las instituciones...",
        {
          instituciones: todasInstituciones,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (instituciones): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (instituciones)",
      {},
      500
    );
  }
}
