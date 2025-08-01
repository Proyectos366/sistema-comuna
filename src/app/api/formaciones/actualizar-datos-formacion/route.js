import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarFormacion from "@/services/validarEditarFormacion";

export async function POST(request) {
  try {
    const { nombre, descripcion, cantidadModulos, id_formacion } =
      await request.json();

    const validaciones = await validarEditarFormacion(
      nombre,
      cantidadModulos,
      descripcion,
      id_formacion
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario || 0,
        descripcion: "Validación fallida al intentar editar la formación",
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

    const formacionDespues = await prisma.formacion.findUnique({
      where: { id: validaciones.id_formacion, borrado: false },
      include: { modulos: true },
    });

    if (!formacionDespues) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_UPDATE_FORMACION",
        id_objeto: validaciones.id_formacion,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo consultar la formación actualizada",
        datosAntes: { nombre, descripcion, id_formacion },
        datosDespues: null,
      });
      return generarRespuesta(
        "error",
        "Error, no se actualizo la formación",
        {},
        400
      );
    }

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "UPDATE_FORMACION",
      id_objeto: formacionDespues.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Formación actualizada con éxito id: ${validaciones.id_formacion}`,
      datosAntes: { nombre, descripcion, id_formacion },
      datosDespues: formacionDespues,
    });

    return generarRespuesta(
      "ok",
      "Formación actualizada",
      { formacion: formacionDespues },
      201
    );
  } catch (error) {
    console.error("Error interno (actualizar formación):", error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la formación",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error interno al actualizar la formación",
      {},
      500
    );
  }
}

/**
  export async function POST(request) {
    try {
      const { nombre, descripcion, cantidadModulos, id_formacion } =
        await request.json();

      const validaciones = await validarEditarFormacion(
        nombre,
        cantidadModulos,
        descripcion,
        id_formacion
      );

      if (validaciones.status === "error") {
        await registrarEventoSeguro(request, {
          tabla: "formacion",
          accion: "INTENTO_FALLIDO",
          id_objeto: 0,
          id_usuario: validaciones?.id_usuario || 0,
          descripcion: "Validación fallida al intentar editar la formación",
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

      // 📝 Actualizar la formación
      await prisma.formacion.update({
        where: { id: validaciones.id_formacion },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          modulos: {
            set: validaciones.todosModulos.map(({ id }) => ({ id })),
          },
        },
      });

      const idsNuevos = validaciones.todosModulos.map((m) => m.id);

      // 🔍 Obtener los módulos actuales registrados en asistencias
      const modulosRegistrados = await prisma.asistencia.findMany({
        where: {
          id_modulo: { in: idsNuevos },
        },
        select: { id_modulo: true },
      });

      const idsRegistrados = [
        ...new Set(modulosRegistrados.map((m) => m.id_modulo)),
      ];

      // ✏️ Comparar listas
      const idsFaltantes = idsNuevos.filter((id) => !idsRegistrados.includes(id));
      const idsObsoletos = idsRegistrados.filter((id) => !idsNuevos.includes(id));

      // 🗑️ Eliminar asistencias que sobran
      if (idsObsoletos.length > 0) {
        await prisma.asistencia.deleteMany({
          where: { id_modulo: { in: idsObsoletos } },
        });
      }

      // ✅ Si hay módulos nuevos, crear asistencias
      if (idsFaltantes.length > 0) {
        const usuariosIds = await prisma.asistencia.findMany({
          distinct: ["id_usuario", "id_vocero", "id_curso"],
          select: {
            id_usuario: true,
            id_vocero: true,
            id_curso: true,
          },
        });

        const nuevosRegistros = [];

        for (const usuario of usuariosIds) {
          for (const moduloId of idsFaltantes) {
            nuevosRegistros.push({
              id_usuario: usuario.id_usuario,
              id_modulo: moduloId,
              id_curso: usuario.id_curso,
              id_vocero: usuario.id_vocero,
              presente: false,
              formador: "",
              fecha_registro: new Date(),
              descripcion: "sin descripcion",
              borrado: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }

        await prisma.asistencia.createMany({
          data: nuevosRegistros,
          skipDuplicates: true, // 🙌 Evita que se creen registros repetidos
        });
      }

      if (actualizarAsistencia) {
        await registrarEventoSeguro(request, {
          tabla: "asistencia",
          accion: "DELETE_ASISTENCIA",
          id_objeto: validaciones.id_formacion,
          id_usuario: validaciones.id_usuario,
          descripcion:
            "Se eliminaron las asistencias de algunos modulos al cambiar la cantidad de modulos en la formacion",
          datosAntes: { nombre, descripcion, cantidadModulos, id_formacion },
          datosDespues: formacionDespues,
        });
      }

      if (!formacionDespues) {
        await registrarEventoSeguro(request, {
          tabla: "formacion",
          accion: "ERROR_UPDATE_FORMACION",
          id_objeto: validaciones.id_formacion,
          id_usuario: validaciones.id_usuario,
          descripcion: "No se pudo consultar la formación actualizada",
          datosAntes: { nombre, descripcion, id_formacion },
          datosDespues: null,
        });

        return generarRespuesta(
          "error",
          "Error, al consultar la formación actualizada",
          {},
          400
        );
      } else {
        await registrarEventoSeguro(request, {
          tabla: "formacion",
          accion: "UPDATE_FORMACION",
          id_objeto: formacionDespues.id,
          id_usuario: validaciones.id_usuario,
          descripcion: `Formación actualizada con éxito id: ${validaciones.id_formacion}`,
          datosAntes: {
            nombre: nombre,
            descripcion: descripcion,
            id_formacion: id_formacion,
          },
          datosDespues: formacionDespues,
        });

        return generarRespuesta(
          "ok",
          "Formación actualizada...",
          { formacion: formacionDespues },
          201
        );
      }
    } catch (error) {
      console.log(`Error interno (actualizar formación): ` + error);

      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_INTERNO",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Error inesperado al actualizar la formación",
        datosAntes: null,
        datosDespues: error.message,
      });

      return generarRespuesta(
        "error",
        "Error interno al actualizar la formación",
        {},
        500
      );
    }
  }
*/

/** 
      const idsAnteriores = validaciones.formacionAntes?.modulos.map((m) => m.id);
      const idsNuevos = validaciones.todosModulos.map((m) => m.id);

      const modulosEliminados = idsAnteriores.filter(
        (id) => !idsNuevos.includes(id)
      );

      const actualizarAsistencia = await prisma.asistencia.deleteMany({
        where: {
          id_modulo: { in: modulosEliminados },
        },
      });

      // 🔍 Obtener los módulos después de actualizar
      const formacionDespues = await prisma.formacion.findUnique({
        where: { id: validaciones.id_formacion },
        include: { modulos: true },
      });

      // Recuperar combinaciones únicas de id_usuario, id_vocero e id_curso
      const usuariosIds = await prisma.asistencia.findMany({
        distinct: ["id_usuario", "id_vocero", "id_curso"],
        select: {
          id_usuario: true,
          id_vocero: true,
          id_curso: true,
        },
      });

      // Preparar el array de nuevos registros
      const nuevosRegistros = [];

      for (const usuario of usuariosIds) {
        for (const moduloId of idsNuevos) {
          nuevosRegistros.push({
            id_usuario: usuario.id_usuario,
            id_modulo: moduloId,
            id_curso: usuario.id_curso,
            id_vocero: usuario.id_vocero,
            presente: false,
            formador: "",
            fecha_registro: new Date(),
            descripcion: "sin descripcion",
            borrado: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Insertar todos los registros en lote
      await prisma.asistencia.createMany({
        data: nuevosRegistros,
      });
    */

/** 
  export async function POST(request) {
    try {
      const { nombre, descripcion, cantidadModulos, id_formacion } =
        await request.json();

      const validaciones = await validarEditarFormacion(
        nombre,
        cantidadModulos,
        descripcion,
        id_formacion
      );

      if (validaciones.status === "error") {
        await registrarEventoSeguro(request, {
          tabla: "formacion",
          accion: "INTENTO_FALLIDO",
          id_objeto: 0,
          id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
          descripcion: "Validacion fallida al intentar editar la formación",
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

      const [actualizada, formacionActualizada] = await prisma.$transaction([
        prisma.formacion.update({
          where: { id: validaciones.id_formacion },
          data: {
            nombre: validaciones.nombre,
            descripcion: validaciones.descripcion,
          },
        }),

        prisma.formacion.findMany({
          where: {
            id: validaciones.id_formacion,
            borrado: false,
          },
        }),
      ]);

      if (!formacionActualizada) {
        await registrarEventoSeguro(request, {
          tabla: "formacion",
          accion: "ERROR_UPDATE_FORMACION",
          id_objeto: validaciones.id_formacion,
          id_usuario: validaciones.id_usuario,
          descripcion: "No se pudo actualizar la formacion",
          datosAntes: { nombre, descripcion, id_formacion },
          datosDespues: actualizada,
        });

        return generarRespuesta(
          "error",
          "Error, al consultar la formación actualizada",
          {},
          400
        );
      } else {
        await registrarEventoSeguro(request, {
          tabla: "formacion",
          accion: "UPDATE_FORMACION",
          id_objeto: formacionActualizada[0]?.id,
          id_usuario: validaciones.id_usuario,
          descripcion: `Formacion actualizada con exito id: ${validaciones.id_formacion}`,
          datosAntes: {
            nombre: nombre,
            descripcion: descripcion,
            id_formacion: id_formacion,
          },
          datosDespues: formacionActualizada,
        });

        return generarRespuesta(
          "ok",
          "Formación actualizada...",
          { formacion: formacionActualizada[0] },
          201
        );
      }
    } catch (error) {
      console.log(`Error interno (actualizar formacion): ` + error);

      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_INTERNO",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Error inesperado al actualizar la formacion",
        datosAntes: null,
        datosDespues: error.message,
      });

      return generarRespuesta(
        "error",
        "Error, interno (actualizar formacion)",
        {},
        500
      );
    }
  }
*/
