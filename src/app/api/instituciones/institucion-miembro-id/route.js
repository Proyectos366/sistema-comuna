import prisma from "@/libs/prisma";
import validarConsultarInstitucionMiembroId from "@/services/instituciones/validarConsultarInstitucionMiembroId";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const validaciones = await validarConsultarInstitucionMiembroId();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const institucionMiembro = await prisma.institucion.findFirst({
      where: {
        id: validaciones.id_institucion,
        borrado: false,
      },
    });

    if (!institucionMiembro) {
      return generarRespuesta(
        "error",
        "Error, al consultar institucion...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Institucion encontrada...",
        {
          instituciones: validaciones.institucion,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (institucion): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (institucion)",
      {},
      500
    );
  }
}
