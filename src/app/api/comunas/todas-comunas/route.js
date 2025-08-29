import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodasComunas from "@/services/comunas/validarConsultarTodasComunas";

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

    let todasComunas;

    if (validaciones.id_rol === 1) {
      todasComunas = await prisma.comuna.findMany({
        where: {
          borrado: false,
        },
      });
    } else {
      todasComunas = await prisma.comuna.findMany({
        where: {
          id_parroquia: {
            in: validaciones.id_parroquias,
          },
          borrado: false, // opcional, si quieres excluir comunas marcadas como borradas
        },
      });
    }

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
