import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearCargo from "@/services/validarCrearCargo";

export async function PATCH(request) {
  try {
    const { modulo, fecha, id_asistencia, nombreFormador } = await request.json();

    /**
    const validaciones = await validarCrearCargo(nombre);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }
    */

    const moduloNumero = Number(modulo);
    const asistencia_id = Number(id_asistencia);

    const moduloEnAsistenciaValidado = await prisma.asistencia.update({
      where: {
        id: asistencia_id,
        id_modulo: moduloNumero,
      },
      data: {
        presente: true,
        fecha_registro: fecha,
        formador: nombreFormador
      },
    });

    // Validamos que la actualización ocurrió correctamente antes de continuar
    if (!moduloEnAsistenciaValidado) {
      return generarRespuesta(
        "error",
        "Error, al validar modulo en asistencia...",
        {},
        400
      );
    }

    // Solo ejecuta la consulta si la asistencia fue actualizada con éxito
    const nuevaAsistencia = await prisma.curso.findFirst({
      where: { id: moduloEnAsistenciaValidado.id_curso, borrado: false }, // Filtra solo el curso afectado
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

    // Validamos que `nuevaAsistencia` realmente existe antes de responder
    if (!nuevaAsistencia) {
      return generarRespuesta(
        "error",
        "Error, no se encontró el curso afectado",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        `Modulo ${moduloNumero} validado...`,
        { curso: nuevaAsistencia },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (cargos): ` + error);

    return generarRespuesta("error", "Error, interno (cargos)", {}, 500);
  }
}
