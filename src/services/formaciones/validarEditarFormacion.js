/**
 @fileoverview Función utilitaria para validar la identidad del usuario, los datos de entrada
 y actualizar una formación existente, incluyendo la sincronización de módulos y asistencias.
 @module services/formaciones/validarEditarFormacion
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos específicos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los datos del usuario y los parámetros requeridos para editar una formación.
 Verifica duplicidad, actualiza módulos asociados y sincroniza asistencias en cursos relacionados.
 @async
 @function validarEditarFormacion
 @param {string} nombre - Nombre de la formación.
 @param {number} cantidadModulos - Número de módulos que debe tener la formación.
 @param {string} descripcion - Descripción de la formación.
 @param {string|number} id_formacion - Identificador único de la formación a editar.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarEditarFormacion(
  nombre,
  cantidadModulos,
  descripcion,
  id_formacion
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
    const validandoCampos = ValidarCampos.validarCamposEditarFormacion(
      nombre,
      cantidadModulos,
      descripcion,
      id_formacion
    );

    // 4. Si los campos son inválidos, retornar error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 5. Verificar si ya existe otra formación con el mismo nombre.
    const existente = await prisma.formacion.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_formacion,
        },
      },
    });

    // 6. Si ya la formacion existe, retornar error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la formación ya existe",
        { id_usuario: validaciones.id_usuario },
        400
      );
    }

    // 7. Obtener la formación actual antes de actualizar.
    const formacionAntes = await prisma.formacion.findUnique({
      where: { id: validandoCampos.id_formacion },
      include: { modulos: true },
    });

    // 8. Obtener los módulos disponibles para asignar a la formación.
    const todosCantidadModulos = await prisma.modulo.findMany({
      where: { borrado: false },
      select: { id: true },
      take: validandoCampos.cantidadModulos,
      orderBy: {
        id: "asc",
      },
    });

    // 9. Si los modulos no existen, retornar error.
    if (!todosCantidadModulos || todosCantidadModulos.length === 0) {
      return retornarRespuestaFunciones(
        "error",
        "Error, no hay cantidad modulos...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 10. Actualizar la formación con los nuevos datos y módulos.
    const actualizarFormacion = await prisma.formacion.update({
      where: { id: validandoCampos.id_formacion },
      data: {
        nombre: validandoCampos.nombre,
        descripcion: validandoCampos.descripcion,
        modulos: {
          set: todosCantidadModulos.map(({ id }) => ({ id })),
        },
      },
    });

    // 11. Si no se actualiza la formacion, retornar error.
    if (!actualizarFormacion) {
      return retornarRespuestaFunciones(
        "error",
        "Error, no se actualizo la formación...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 12. Obtener los cursos asociados a la formación.
    const cursos = await prisma.curso.findMany({
      where: {
        id_formacion: validandoCampos.id_formacion,
        borrado: false,
      },
    });

    // 13. Obtener los módulos actualizados de la formación.
    const formacionConModulos = await prisma.formacion.findUnique({
      where: { id: validandoCampos.id_formacion },
      include: { modulos: true },
    });

    // 14. Extrayendo los modulos actualizados.
    const modulosActualizados = formacionConModulos?.modulos || [];

    // 15. Sincronizar asistencias en cada curso según los nuevos módulos.
    for (const curso of cursos) {
      const asistenciasActuales = await prisma.asistencia.findMany({
        where: { id_curso: curso.id, borrado: false },
      });

      // 16. Recorremos los modulos y filtramos.
      const modulosActualesIds = asistenciasActuales.map((a) => a.id_modulo);
      const nuevosModulos = modulosActualizados.filter(
        (modulo) => !modulosActualesIds.includes(modulo.id)
      );

      // 17. Recorremos cada modulo para ir creando las asistencias.
      for (const modulo of nuevosModulos) {
        await prisma.asistencia.create({
          data: {
            id_vocero: curso.id_vocero,
            id_modulo: modulo.id,
            id_curso: curso.id,
            id_usuario: curso.id_usuario,
            presente: false,
            fecha_registro: new Date(),
          },
        });
      }

      const modulosPermitidos = modulosActualizados.map((m) => m.id);

      // 18. Filtramos las asistencias actuales en caso de que cambie la cantidad de modulo por
      // formacion.
      const asistenciasAEliminar = asistenciasActuales.filter(
        (a) => !modulosPermitidos.includes(a.id_modulo)
      );

      // 19. Ejecutamos una funcion para cambiar los modulos por asistencia.
      await Promise.all(
        asistenciasAEliminar.map((a) =>
          prisma.asistencia.update({
            where: { id: a.id },
            data: { borrado: true },
          })
        )
      );
    }

    // 20. Si todas las validaciones son correctas, se retorna la información consolidada.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      cantidadModulos: validandoCampos.cantidadModulos,
      descripcion: validandoCampos.descripcion,
      todosModulos: todosCantidadModulos,
      formacionAntes: formacionAntes,
      id_formacion: validandoCampos.id_formacion,
    });
  } catch (error) {
    // 21. Manejo de errores inesperados.
    console.log("Error interno validar editar formación: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar formación..."
    );
  }
}
