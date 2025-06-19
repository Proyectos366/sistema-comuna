import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function PATCH(request) {
  try {
    const { id_curso, id_vocero } = await request.json();

    const cursoId = Number(id_curso);
    const voceroId = Number(id_vocero);

    const certificandoCurso = await prisma.curso.update({
      where: {
        id: cursoId,
        id_vocero: voceroId,
      },
      data: {
        certificado: true,
        fecha_completado: new Date(),
        culminado: true,
      },
    });

    const cursoCertificado = await prisma.curso.findFirst({
      where: { id: certificandoCurso.id, borrado: false }, // Filtra solo el curso afectado
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

    if (!cursoCertificado) {
      return generarRespuesta("error", "Error, no se certifico...", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Certificado con exito...",
        {
          curso: cursoCertificado,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (certificar curso): ` + error);

    return generarRespuesta("error", "Error, interno (certificar curso)", {}, 500);
  }
}
