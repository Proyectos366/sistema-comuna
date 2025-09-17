import { startOfWeek, endOfWeek } from "date-fns";
import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

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

    const resultado = await prisma.$transaction(async (tx) => {
      const nuevaNovedad = await tx.novedad.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          prioridad: validaciones.prioridad,
          id_usuario: validaciones.id_usuario,
          id_institucion: validaciones.id_institucion,
        },
      });

      await tx.novedadDepartamento.createMany({
        data: departamentos.map((d) => ({
          id_novedad: nuevaNovedad.id,
          id_departamento: d.id,
        })),
      });

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
    console.log("Error interno validar crear novedad: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear novedad"
    );
  }
}
