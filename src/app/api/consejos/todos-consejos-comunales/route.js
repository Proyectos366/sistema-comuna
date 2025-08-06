import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodosConsejosComunales from "@/services/consejos-comunales/validarConsultarTodosConsejos";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodosConsejosComunales();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todosConsejosComunales = await prisma.consejo.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todosConsejosComunales) {
      return generarRespuesta(
        "error",
        "Error, al consultar consejos comunales...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todos los consejos comunales...",
        {
          consejos: todosConsejosComunales,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (consejos comunales): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (consejos comunales)",
      {},
      500
    );
  }
}
