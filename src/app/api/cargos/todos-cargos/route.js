import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodosCargos from "@/services/cargos/validarConsultarTodosCargos";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodosCargos();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todosCargos = await prisma.cargo.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todosCargos) {
      return generarRespuesta(
        "error",
        "Error, al consultar cargos...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas los cargos...",
        {
          cargos: todosCargos,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (cargos): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (cargos)",
      {},
      500
    );
  }
}
