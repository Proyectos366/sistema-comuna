/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los datos requeridos
 antes de crear una novedad masiva asociada a múltiples departamentos, incluyendo notificaciones.
 @module services/novedades/validarCrearNovedadTodos
*/

import { startOfWeek, endOfWeek } from "date-fns"; // Utilidades para calcular rangos semanales
import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y los datos necesarios para crear una novedad masiva.
 Crea la novedad, la asocia a departamentos y genera notificaciones correspondientes.
 @async
 @function validarCrearNovedadTodos
 @param {Object} validar - Objeto con los datos de la novedad y los departamentos asociados.
 @param {string} validar.nombre - Nombre de la novedad.
 @param {string} validar.descripcion - Descripción de la novedad.
 @param {string|number} validar.prioridad - Nivel de prioridad de la novedad.
 @param {string|number} validar.id_usuario - ID del usuario que crea la novedad.
 @param {string|number} validar.id_institucion - ID de la institución asociada.
 @param {Array<{id: string|number}>} validar.departamentos - Lista de departamentos a notificar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la operación.
*/
export default async function validarCrearNovedadTodos(validar) {
  try {
    // 1. Validar identidad del usuario mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Se obtienen los departamentos a los que se va agregar la novedad.
    const departamentos = validar.departamentos;

    // 4. Validar que se hayan proporcionado departamentos válidos.
    if (!Array.isArray(departamentos) || departamentos.length === 0) {
      return retornarRespuestaFunciones(
        "error",
        "No se proporcionaron departamentos válidos",
        {},
        400
      );
    }

    // 5. Ejecutar transacción para crear novedad, asociaciones y notificaciones.
    const resultado = await prisma.$transaction(async (tx) => {
      // 5.1. Crear la novedad principal con los datos proporcionados.
      const nuevaNovedad = await tx.novedad.create({
        data: {
          nombre: validar.nombre,
          descripcion: validar.descripcion,
          prioridad: validar.prioridad,
          id_usuario: validar.id_usuario,
          id_institucion: validar.id_institucion,
        },
      });

      // 5.2. Asociar la novedad a cada departamento mediante registros en novedadDepartamento.
      await tx.novedadDepartamento.createMany({
        data: departamentos.map((d) => ({
          id_novedad: nuevaNovedad.id,
          id_departamento: d.id,
        })),
      });

      // 5.3. Preparar las notificaciones para cada departamento receptor.
      const notificacionesData = departamentos.map((d) => ({
        mensaje: nuevaNovedad.nombre,
        id_emisor: null,
        id_receptor: d.id,
      }));

      // 5.4. Crear las notificaciones en lote para todos los departamentos.
      await tx.notificacion.createMany({
        data: notificacionesData,
      });

      // 4.5. Retornar los datos consolidados de la novedad y las notificaciones generadas.
      return {
        novedad: nuevaNovedad,
        notificaciones: notificacionesData,
      };
    });

    // 6. Calcular el rango de la semana actual (lunes a domingo).
    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });

    // 7. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
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
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar crear novedad: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear novedad"
    );
  }
}
