/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los parámetros
 necesarios antes de crear una novedad individual, asociada a un departamento o a toda la institución.
 @module services/novedades/validarCrearNovedad
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { startOfWeek, endOfWeek } from "date-fns"; // Utilidades para calcular el rango semanal
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos específicos
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los datos del usuario y los parámetros requeridos para crear una novedad.
 Asocia la novedad al departamento correspondiente y genera una notificación.
 @async
 @function validarCrearNovedad
 @param {string} nombre - Nombre de la novedad.
 @param {string} descripcion - Descripción de la novedad.
 @param {string|number} id_institucion - Identificador de la institución.
 @param {string|number} id_departamento - Identificador del departamento receptor.
 @param {number} rango - Nivel de alcance (1 = institucional, 2 = departamental).
 @param {number} prioridad - Nivel de prioridad (1 = alta, 2 = media, 3 = baja).
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearNovedad(
  nombre,
  descripcion,
  id_institucion,
  id_departamento,
  rango,
  prioridad
) {
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

    // 3. Validar los campos de entrada.
    const validarCampos = ValidarCampos.validarCamposCrearNovedad(
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango,
      prioridad
    );

    // 4. Si los campos son inválidos, retornar error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
        { id_usuario: validaciones.id_usuario }
      );
    }

    // 5. Variable para almacenar el o los departamentos.
    let departamentos;

    // 6. Si el usuario tiene rol administrativo, obtener todos los departamentos de la institución.
    if (validaciones.id_rol === 1) {
      departamentos = await prisma.departamento.findMany({
        where: {
          id_institucion: validarCampos.id_institucion,
        },
        select: {
          id: true,
        },
      });
    }

    // 7. Mapeo de prioridad numérica a texto.
    const mapaPrioridad = {
      1: "alta",
      2: "media",
      3: "baja",
    };

    // 8. Crear la novedad en la base de datos.
    const nuevaNovedad = await prisma.novedad.create({
      data: {
        nombre: validarCampos.nombre,
        descripcion: validarCampos.descripcion,
        prioridad: validarCampos.prioridad,
        id_usuario: validarCampos.id_usuario,
        id_institucion: validarCampos.id_institucion,
      },
    });

    // 9. Asociar la novedad al departamento correspondiente.
    const noveDepa = await prisma.novedadDepartamento.createMany({
      data: {
        id_novedad: nuevaNovedad.id,
        id_departamento: validarCampos.id_departamento,
      },
    });

    // 10. Crear la notificación para el departamento receptor.
    const nuevaNotificacion = await prisma.notificacion.create({
      data: {
        mensaje: validarCampos.nombre,
        id_emisor: validarCampos.id_depa_origen,
        id_receptor: validarCampos.id_departamento,
      },
    });

    // 11. Calcular el rango semanal actual (lunes a domingo).
    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });

    // 12. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      rango: validarCampos.rango,
      prioridad: mapaPrioridad[validarCampos.prioridad],
      departamentos: departamentos ? departamentos : [],
      inicioSemana: inicioSemana,
      finSemana: finSemana,
      id_novedad: nuevaNovedad.id,
      id_institucion:
        validarCampos.rango === 1
          ? validarCampos.id_institucion
          : validaciones.id_institucion,
      id_departamento:
        validarCampos.rango === 1 ? null : validarCampos.id_departamento,
      id_depa_origen:
        validarCampos.rango === 1 ? null : validaciones.id_departamento,
    });
  } catch (error) {
    // 12. Manejo de errores inesperados.
    console.log("Error interno validar crear novedad: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear novedad"
    );
  }
}
