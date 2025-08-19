/** 
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

      console.log(validaciones);

      if (validaciones.status === "error") {
        return generarRespuesta(
          validaciones.status,
          validaciones.message,
          {},
          400
        );
      }

      const nuevaNovedad = await prisma.novedad.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          prioridad: validaciones.prioridad, // o Prioridad.alta si usas enum
          id_usuario: validaciones.id_usuario,
          id_institucion: validaciones.id_institucion,
        },
      });

      const relaciones = await Promise.all(
        validaciones?.departamentos.map((idDepto) =>
          prisma.novedadDepartamento.create({
            data: {
              id_novedad: nuevaNovedad.id,
              id_departamento: idDepto.id,
            },
          })
        )
      );

      const notificaciones = await Promise.all(
        validaciones?.departamentos.map((idDepto) =>
          prisma.notificacion.create({
            data: {
              mensaje: `${nuevaNovedad.nombre}`,
              id_emisor: null, // departamento del creador
              id_receptor: idDepto.id,
            },
          })
        )
      );

      if (!nuevaNovedad) {
        return generarRespuesta("error", "Error, no se creo la novedad", {}, 400);
      } else {
        return generarRespuesta(
          "ok",
          "Novedad creada...",
          {
            novedades: nuevaNovedad?.novedades ? nuevaNovedad?.novedades[0] : [],
          },
          201
        );
      }
    } catch (error) {
      console.log(`Error interno (novedades): ` + error);
      return generarRespuesta("error", "Error, interno (novedades)", {}, 500);
    }
  }
*/

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
      const nuevaNovedad = await prisma.novedad.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          prioridad: validaciones.prioridad,
          id_usuario: validaciones.id_usuario,
          id_institucion: validaciones.id_institucion,
        },
      });

      const departamentos = validaciones.departamentos;

      if (!Array.isArray(departamentos) || departamentos.length === 0) {
        return generarRespuesta(
          "error",
          "No se proporcionaron departamentos válidos",
          {},
          400
        );
      }

      // Relaciones con departamentos
      await prisma.novedadDepartamento.createMany({
        data: departamentos.map((d) => ({
          id_novedad: nuevaNovedad.id,
          id_departamento: d.id,
        })),
      });

      // Notificaciones
      await prisma.notificacion.createMany({
        data: departamentos.map((d) => ({
          mensaje: nuevaNovedad.nombre,
          id_emisor: null,
          id_receptor: d.id,
        })),
      });
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

    const departamentos = validaciones.departamentos;

    if (!Array.isArray(departamentos) || departamentos.length === 0) {
      return generarRespuesta(
        "error",
        "No se proporcionaron departamentos válidos",
        {},
        400
      );
    }

    // Crear relaciones con departamentos
    await prisma.novedadDepartamento.createMany({
      data: departamentos.map((d) => ({
        id_novedad: nuevaNovedad.id,
        id_departamento: d.id,
      })),
    });

    // Crear notificaciones
    const notificacionesData = departamentos.map((d) => ({
      mensaje: nuevaNovedad.nombre,
      id_emisor: null,
      id_receptor: d.id,
    }));

    await prisma.notificacion.createMany({
      data: notificacionesData,
    });

    // Preparar respuesta enriquecida
    const respuesta = {
      novedad: nuevaNovedad,
      departamentos: departamentos.map((d) => ({
        id: d.id,
        nombre: d.nombre || null, // si tienes el nombre disponible
      })),
      notificaciones: notificacionesData,
    };

    return generarRespuesta(
      "ok",
      "Novedad creada correctamente",
      { novedades: respuesta },
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
