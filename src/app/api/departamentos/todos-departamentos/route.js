import prisma from "@/libs/prisma";
import validarConsultarTodosDepartamentos from "@/services/departamentos/validarConsultarTodosDepartamentos";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodosDepartamentos();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todosDepartamentos = await prisma.departamento.findMany({
      where: {
        id_institucion: validaciones.id_institucion,
        borrado: false,
      },
    });

    if (!todosDepartamentos) {
      return generarRespuesta(
        "error",
        "Error, al consultar todos los departamentos...",
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
