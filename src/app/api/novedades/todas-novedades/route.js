import prisma from "@/libs/prisma";
import validarConsultarTodasNovedades from "@/services/novedades/validarConsultarTodasNovedades";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodasNovedades();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    /**
      const todasNovedades = await prisma.novedad.findMany({
        where: {
          borrado: false,
        },
      });
    */

    const todasNovedades = await prisma.novedad.findMany({
      where: {
        borrado: false,
      },
      include: {
        recepciones: {
          select: {
            id: true,
            id_novedad: true,
            recibido: true,
            fechaRecibido: true,
          },
        },
      },
    });

    /** 
    const [recepciones, institucionales] = await Promise.all([
      prisma.recepcionDepartamento.findMany({
        where: {
          novedades: {
            borrado: false,
          },
        },
        include: {
          novedades: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              id_usuario: true,
              id_institucion: true,
              createdAt: true,
            },
          },
        },
      }),

      prisma.novedad.findMany({
        where: {
          borrado: false,
          recepcionDepartamento: {
            none: {}, // No tienen ninguna recepción asignada
          },
        },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          id_usuario: true,
          id_institucion: true,
          createdAt: true,
        },
      }),
    ]);

    
    const todasNovedades = [
      ...recepciones.map((r) => ({
        id: r.novedades.id,
        nombre: r.novedades.nombre,
        descripcion: r.novedades.descripcion,
        recibido: r.recibido,
        fechaRecibido: r.fechaRecibido,
        id_departamento: r.id_departamento,
        id_usuario: r.novedades.id_usuario,
        id_institucion: r.novedades.id_institucion,
        createdAt: r.novedades.createdAt,
      })),
      ...institucionales.map((n) => ({
        id: n.id,
        nombre: n.nombre,
        descripcion: n.descripcion,
        recibido: null,
        fechaRecibido: null,
        id_departamento: null,
        id_usuario: n.id_usuario,
        id_institucion: n.id_institucion,
        createdAt: n.createdAt,
      })),
    ];
*/

    if (!todasNovedades) {
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
          novedades: todasNovedades,
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
