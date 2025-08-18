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

    /** 
      const novedades = await prisma.novedad.findMany({
        where: {
          recepciones: {
            some: {
              id_departamento: validaciones.id_departamento,
            },
          },
          borrado: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          recepciones: {
            where: {
              id_departamento: validaciones.id_departamento,
            },
          },
          usuarios: true,
          departamentos: true,
        },
      });
    */


      
      const novedades = await prisma.novedad.findMany({
  where: {
    borrado: false,
    OR: [
      {
        // Novedades creadas por el departamento
        id_depa_origen: validaciones.id_departamento,
      },
      {
        // Novedades recibidas por el departamento
        recepciones: {
          some: {
            id_departamento: validaciones.id_departamento,
          },
        },
      },
    ],
  },
  orderBy: {
    createdAt: "desc",
  },
  include: {
    recepciones: {
      where: {
        id_departamento: validaciones.id_departamento,
      },
    },
    usuarios: true,
    departamentos: true,
  },
});

console.log(novedades);


    if (!novedades) {
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
          novedades: novedades,
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
