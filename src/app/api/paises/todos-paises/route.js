import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodosPaises from "@/services/paises/validarConsultarTodosPaises";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodosPaises();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    /** 
      const todosPaises = await prisma.pais.findMany({
        where: {
          borrado: false,
        },
      });
    */

    const todosPaises = await prisma.pais.findMany({
      where: {
        borrado: false,
      },
      include: {
        estados: {
          include: {
            municipios: {
              include: {
                parroquias: true,
              },
            },
          },
        },
      },
    });

    if (!todosPaises) {
      return generarRespuesta(
        "error",
        "Error, al consultar paises...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todos los paises...",
        {
          paises: todosPaises,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (paises): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (paises)",
      {},
      500
    );
  }
}
