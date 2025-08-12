import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodosEstados from "@/services/estados/validarConsultarTodosEstados";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodosEstados();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todosEstados = await prisma.estado.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todosEstados) {
      return generarRespuesta(
        "error",
        "Error, al consultar estados...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todos los estados...",
        {
          estados: todosEstados,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (estados): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (estados)",
      {},
      500
    );
  }
}
