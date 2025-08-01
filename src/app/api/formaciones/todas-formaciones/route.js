import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodasFormaciones from "@/services/validarConsultarTodasFormaciones";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodasFormaciones();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    /** 
      // Esta consulta sera para el futuro para mostrar formaciones solo por departamento
      const todasFormaciones = await prisma.formacion.findMany({
        where: {
          borrado: false,
          culminada: false,
          id_departamento: validaciones.id_departamento,
        },
      });
    */

    const todasFormaciones = await prisma.formacion.findMany({
      where: {
        borrado: false,
        culminada: false,
      },
      include: { modulos: true },
    });

    if (!todasFormaciones) {
      return generarRespuesta(
        "error",
        "Error, al consultar formaciones...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas las formaciones...",
        {
          formaciones: todasFormaciones,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (formaciones): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (formaciones)",
      {},
      500
    );
  }
}
