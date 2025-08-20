import { startOfWeek, endOfWeek } from "date-fns";
import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearNovedad from "@/services/novedades/validarCrearNovedad";

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

    /** 
      const departamentos = validaciones.departamentos;

      if (!Array.isArray(departamentos) || departamentos.length === 0) {
        return generarRespuesta(
          "error",
          "No se proporcionaron departamentos válidos",
          {},
          400
        );
      }

      

      // Crear notificaciones
      const notificacionesData = departamentos.map((d) => ({
        mensaje: nuevaNovedad.nombre,
        id_emisor: null,
        id_receptor: d.id,
      }));

      await prisma.notificacion.createMany({
        data: notificacionesData,
      });

      const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lunes
      const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 }); // Domingo

      const novedades = await prisma.novedadDepartamento.findMany({
        where: {
          id_novedad: nuevaNovedad.id,
          estatus: "pendiente",
          OR: [
            { fechaRecepcion: null },
            {
              fechaRecepcion: {
                gte: inicioSemana,
                lte: finSemana,
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
    */

    const nuevaNovedad = await prisma.novedad.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        prioridad: validaciones.prioridad,
        id_usuario: validaciones.id_usuario,
        id_institucion: validaciones.id_institucion,
      },
    });

    // Crear relaciones con departamentos
    const noveDepa = await prisma.novedadDepartamento.createMany({
      data: {
        id_novedad: nuevaNovedad.id,
        id_departamento: validaciones.id_departamento,
      },
    });

    const nuevaNotificacion = await prisma.notificacion.create({
      data: {
        mensaje: validaciones.nombre,
        id_emisor: validaciones.id_depa_origen,
        id_receptor: validaciones.id_departamento,
      },
    });

    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });

    const novedades = await prisma.novedadDepartamento.findMany({
      where: {
        id_novedad: nuevaNovedad.id_novedad,
        estatus: "pendiente",
        OR: [
          { fechaRecepcion: null },
          {
            fechaRecepcion: {
              gte: inicioSemana,
              lte: finSemana,
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

    console.log(validaciones);

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
    console.error("Error interno (novedades):", error);
    return generarRespuesta(
      "error",
      "Error interno al crear la novedad",
      {},
      500
    );
  }
}
