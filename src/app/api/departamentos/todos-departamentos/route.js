import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    

    const todosDepartamentos = await prisma.departamento.findMany({
      where: {
        borrado: false
      }
    });

    if (!todosDepartamentos) {
      return generarRespuesta(
        "error",
        "Error, al consultar departamentos...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas los departamentos...",
        {
          departamentos: todosDepartamentos,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (departamentos): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (departamentos)",
      {},
      500
    );
  }
}
