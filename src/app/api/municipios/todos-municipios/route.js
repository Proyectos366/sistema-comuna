import prisma from "@/libs/prisma";
import validarConsultarTodosMunicipios from "@/services/municipios/validarConsultarTodosMunicipios";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodosMunicipios();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todosMunicipios = await prisma.municipio.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todosMunicipios) {
      return generarRespuesta(
        "error",
        "Error, al consultar municipios...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todos los municipios...",
        {
          municipios: todosMunicipios,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (municipios): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (municipios)",
      {},
      500
    );
  }
}
