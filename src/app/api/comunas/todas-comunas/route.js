import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodasComunas from "@/services/validarConsultarTodasComunas";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodasComunas();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todasComunas = await prisma.comuna.findMany({
      where: {
        borrado: false,
      },
    });

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
