import prisma from "@/libs/prisma";
import validarConsultarTodasNovedadesDepartamento from "@/services/novedades/validarConsultarTodasNovedadesDepartamento";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodasNovedadesDepartamento();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todasNovedadeDepartamento = await prisma.novedad.findMany({
      where: {
        borrado: false,
        id_departamento: validaciones.id_departamento,
      },
    });

    if (!todasNovedadeDepartamento) {
      return generarRespuesta(
        "error",
        "Error, al consultar novedades...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas las novedades...",
        {
          novedades: todasNovedadeDepartamento,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (novedades): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (novedades)",
      {},
      500
    );
  }
}
