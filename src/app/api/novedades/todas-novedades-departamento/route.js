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

    const novedades = await prisma.novedadDepartamento.findMany({
      where: {
        id_departamento: validaciones.id_departamento,
      },
      include: {
        novedades: {
          include: {
            usuarios: true,
            institucion: true,
            departamento: true,
            destinatarios: {
              include: {
                departamento: true,
              },
            },
          },
        },
        departamento: true,
      },
    });

    const resultado = novedades.map((novedadDepto) => {
      const novedad = novedadDepto.novedades;

      const esCreador = novedad.id_usuario === validaciones.id_usuario;

      const destinatario = novedad.destinatarios.find(
        (d) => d.departamento.id === validaciones.id_departamento
      );

      return {
        id: novedad.id,
        nombre: novedad.nombre,
        descripcion: novedad.descripcion,
        prioridad: novedad.prioridad,
        fechaCreacion: novedad.createdAt,
        fechaRecepcion: novedadDepto.fechaRecepcion,
        estatus: destinatario?.estatus || novedadDepto.estatus,
        vista: esCreador ? "creador" : "destinatario",

        creador: {
          id: novedad.usuarios.id,
          nombre: novedad.usuarios.nombre,
        },

        institucion: novedad.institucion
          ? {
              id: novedad.institucion.id,
              nombre: novedad.institucion.nombre,
            }
          : null,

        departamentoReceptor: {
          id: novedadDepto.departamento.id,
          nombre: novedadDepto.departamento.nombre,
          descripcion: novedadDepto.departamento.descripcion,
        },
      };
    });

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
          novedades: resultado,
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
