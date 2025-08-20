import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearNovedad from "@/services/novedades/validarCrearNovedad";
import validarCrearNovedadTodos from "@/services/novedades/validarCrearNovedadTodos";

export async function POST(request) {
  try {
    const {
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango,
      prioridad,
    } = await request.json();

    const validaciones = await validarCrearNovedad(
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango,
      prioridad
    );

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const validacionesCrear = await validarCrearNovedadTodos(validaciones);

    const novedades = await prisma.novedadDepartamento.findMany({
      where: {
        id_novedad: validacionesCrear.id_novedad,
        estatus: "pendiente",
        OR: [
          { fechaRecepcion: null },
          {
            fechaRecepcion: {
              gte: validacionesCrear.inicioSemana,
              lte: validacionesCrear.finSemana,
            },
          },
        ],
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
              orderBy: {
                fechaRecepcion: "desc",
              },
            },
          },
        },
        departamento: true,
      },
    });

    const resultado = novedades
      .map((novedadDepto) => {
        if (!novedadDepto.novedades) return null;
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
      })
      .filter(Boolean);

    return generarRespuesta(
      "ok",
      "Novedad creada correctamente",
      { novedades: resultado },
      201
    );
  } catch (error) {
    console.error("Error interno (todas novedades):", error);
    return generarRespuesta(
      "error",
      "Error interno al crear todas novedades",
      {},
      500
    );
  }
}
