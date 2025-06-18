import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function PATCH(request) {
  try {
    const { id_curso, id_vocero } = await request.json();

    const cursoId = Number(id_curso);
    const voceroId = Number(id_vocero);

    const verificarCurso = await prisma.curso.update({
      where: {
        id: cursoId,
        id_vocero: voceroId,
      },
      data: {
        verificado: true,
        updatedAt: new Date(),
      },
    });

    const nuevaAsistencia = await prisma.curso.findFirst({
      where: { id: verificarCurso.id_curso, borrado: false }, // Filtra solo el curso afectado
      include: {
        voceros: {
          select: {
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            cedula: true,
            telefono: true,
            correo: true,
            edad: true,
            genero: true,
            comunas: { select: { nombre: true } },
          },
        },
        formaciones: {
          include: {
            modulos: {
              include: {
                asistencias: true,
              },
            },
          },
        },
        asistencias: true, // Solo las asistencias relacionadas con el curso afectado
      },
    });

    if (!nuevaAsistencia) {
      return generarRespuesta("error", "Error, no se valido", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Verificado con exito...",
        {
          curso: nuevaAsistencia,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (validar curso): ` + error);

    return generarRespuesta("error", "Error, interno (validar curso)", {}, 500);
  }
}
