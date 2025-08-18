import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarNovedad from "@/services/novedades/validarEditarNovedad";

export async function POST(request) {
  try {
    const { nombre, descripcion, id_novedad } = await request.json();

    const validaciones = await validarEditarNovedad(
      nombre,
      descripcion,
      id_novedad
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "INTENTO_FALLIDO_NOVEDAD",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar la novedad",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    /** 
      const [actualizada, novedadActualizada] = await prisma.$transaction([
        prisma.novedad.update({
          where: { id: validaciones.id_novedad },
          data: {
            nombre: validaciones.nombre,
            descripcion: validaciones.descripcion,
          },
        }),

        prisma.novedad.findMany({
          where: {
            id: validaciones.id_novedad,
            borrado: false,
          },
        }),
      ]);
    */

    /** 
      const { novedades } = await prisma.$transaction(async (tx) => {
        prisma.novedad.update({
          where: { id: validaciones.id_novedad },
          data: {
            nombre: validaciones.nombre,
            descripcion: validaciones.descripcion,
          },
        });

        prisma.novedad.findFirst({
          where: {
            id: validaciones.id_novedad,
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

        // Transformar la respuesta para el frontend
        const novedades = recepciones.map((r) => ({
          id: r.novedades.id,
          nombre: r.novedades.nombre,
          descripcion: r.novedades.descripcion,
          recibido: r.recibido,
          fechaRecibido: r.fechaRecibido,
          id_departamento: r.id_departamento,
        }));

        return { novedades };
      });
    */



      const { novedades } = await prisma.$transaction(async (tx) => {
  // 1. Actualizar la novedad
  await tx.novedad.update({
    where: { id: validaciones.id_novedad },
    data: {
      nombre: validaciones.nombre,
      descripcion: validaciones.descripcion,
    },
  });

  // 2. Obtener la novedad con sus recepciones
  const novedadActualizada = await tx.novedad.findFirst({
    where: {
      id: validaciones.id_novedad,
      borrado: false,
    },
    include: {
      recepciones: {
        select: {
          id: true,
          id_novedad: true,
          recibido: true,
          fechaRecibido: true,
          id_departamento: true, // Asegúrate de que este campo existe
        },
      },
    },
  });


  console.log(novedadActualizada);
  console.log();
  console.log();
  

  // 3. Transformar la respuesta para el frontend
  const novedades = novedadActualizada.recepciones.map((r) => ({
    id: novedadActualizada.id,
    nombre: novedadActualizada.nombre,
    descripcion: novedadActualizada.descripcion,
    recibido: r.recibido,
    fechaRecibido: r.fechaRecibido,
    id_departamento: r.id_departamento,
  }));

  






  console.log(novedades);

  return { novedades };
});




    if (!novedades) {
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "ERROR_UPDATE_NOVEDAD",
        id_objeto: validaciones.id_novedad,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la novedad",
        datosAntes: { nombre, descripcion, id_novedad },
        datosDespues: novedades,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar la novedad actualizada",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "UPDATE_NOVEDAD",
        id_objeto: novedades.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Novedad actualizada con exito id: ${validaciones.id_novedad}`,
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          id_novedad: id_novedad,
        },
        datosDespues: novedades,
      });

      return generarRespuesta(
        "ok",
        "Novedad actualizada...",
        { novedades: novedades },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar novedad): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "novedad",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la novedad",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar novedad)",
      {},
      500
    );
  }
}
