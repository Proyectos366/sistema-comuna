/** 
  import { startOfWeek, endOfWeek } from "date-fns";
  import prisma from "@/libs/prisma";
  import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

  export default async function validarCrearNovedadTodos(validaciones) {
    try {
      // Crear la novedad
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
        return retornarRespuestaFunciones(
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

      // Calcular inicio y fin de semana
      const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
      const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });

      // Retornar datos relevantes
      return retornarRespuestaFunciones(
        "exito",
        "Todas novedad creada correctamente...",
        {
          id_novedad: nuevaNovedad.id,
          departamentos: departamentos.map((d) => d.id),
          notificaciones: notificacionesData,
          inicioSemana: inicioSemana,
          finSemana: finSemana,
        },
        200
      );
    } catch (error) {
      console.error("Error al crear todas novedad:", error);
      return retornarRespuestaFunciones(
        "error",
        "Error al crear todas novedades",
        {},
        500
      );
    }
  }
*/

import { startOfWeek, endOfWeek } from "date-fns";
import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarCrearNovedadTodos(validaciones) {
  try {
    const departamentos = validaciones.departamentos;

    if (!Array.isArray(departamentos) || departamentos.length === 0) {
      return retornarRespuestaFunciones(
        "error",
        "No se proporcionaron departamentos válidos",
        {},
        400
      );
    }

    // Ejecutar todo dentro de una transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // Crear novedad
      const nuevaNovedad = await tx.novedad.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          prioridad: validaciones.prioridad,
          id_usuario: validaciones.id_usuario,
          id_institucion: validaciones.id_institucion,
        },
      });

      // Crear relaciones con departamentos
      await tx.novedadDepartamento.createMany({
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

      await tx.notificacion.createMany({
        data: notificacionesData,
      });

      return {
        novedad: nuevaNovedad,
        notificaciones: notificacionesData,
      };
    });

    // Calcular inicio y fin de semana
    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });

    return retornarRespuestaFunciones(
      "exito",
      "Novedad creada correctamente",
      {
        id_novedad: resultado.novedad.id,
        departamentos: departamentos.map((d) => d.id),
        notificaciones: resultado.notificaciones,
        inicioSemana,
        finSemana,
      },
      200
    );
  } catch (error) {
    console.error("Error al crear novedad con transacción:", error);
    return retornarRespuestaFunciones(
      "error",
      "Error al crear la novedad. No se guardó ningún dato.",
      { detalle: error.message },
      500
    );
  }
}
