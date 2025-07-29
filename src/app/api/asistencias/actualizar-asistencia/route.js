import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarAsistenciaPorModulo from "@/services/validarAsistenciaPorModulo";
import registrarEventoSeguro from "@/libs/trigget";

export async function PATCH(request) {
  try {
    const { modulo, fecha, id_asistencia, nombreFormador } =
      await request.json();

    const validaciones = await validarAsistenciaPorModulo(
      modulo,
      fecha,
      id_asistencia,
      nombreFormador
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "asistencia",
        accion: "INTENTO_FALLIDO_ASISTENCIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: `Validacion fallida al intentar validar la asistencia de id: ${validaciones.id_asistencia} y modulo ${validaciones.modulo}`,
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
      const moduloEnAsistenciaValidado = await prisma.asistencia.update({
        where: {
          id: validaciones.id_asistencia,
          id_modulo: validaciones.modulo,
        },
        data: {
          presente: true,
          fecha_registro: validaciones.fecha,
          formador: validaciones.nombreFormador,
        },
      });
    */

    const [moduloEnAsistenciaValidado, nuevaAsistencia] =
      await prisma.$transaction(async (tx) => {
        const asistenciaActualizada = await tx.asistencia.update({
          where: {
            id: validaciones.id_asistencia,
            id_modulo: validaciones.modulo,
          },
          data: {
            presente: true,
            fecha_registro: validaciones.fecha,
            formador: validaciones.nombreFormador,
          },
        });

        const cursoRelacionado = await tx.curso.findFirst({
          where: {
            id: asistenciaActualizada.id_curso,
            borrado: false,
          },
          include: {
            voceros: {
              select: {
                nombre: true,
                nombre_dos: true,
                apellido: true,
                apellido_dos: true,
                cedula: true,
                telefono: true,
                correo: true,
                edad: true,
                genero: true,
                comunas: { select: { nombre: true } },
              },
            },
            formaciones: {
              include: {
                modulos: {
                  include: {
                    asistencias: true,
                  },
                },
              },
            },
            asistencias: true,
          },
        });

        return [asistenciaActualizada, cursoRelacionado];
      });

    // Validamos que la actualización ocurrió correctamente antes de continuar
    if (!moduloEnAsistenciaValidado) {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "ERROR_UPDATE_ASISTENCIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: `No se pudo actualizar la asistencia con el id: ${validaciones.id_asistencia} y modulo: ${validaciones.modulo}`,
        datosAntes: null,
        datosDespues: moduloEnAsistenciaValidado,
      });

      return generarRespuesta(
        "error",
        "Error, al validar modulo en asistencia...",
        {},
        400
      );
    }

    /** 
      // Solo ejecuta la consulta si la asistencia fue actualizada con éxito
      const nuevaAsistencia = await prisma.curso.findFirst({
        where: { id: moduloEnAsistenciaValidado.id_curso, borrado: false }, // Filtra solo el curso afectado
        include: {
          voceros: {
            select: {
              nombre: true,
              nombre_dos: true,
              apellido: true,
              apellido_dos: true,
              cedula: true,
              telefono: true,
              correo: true,
              edad: true,
              genero: true,
              comunas: { select: { nombre: true } },
            },
          },
          formaciones: {
            include: {
              modulos: {
                include: {
                  asistencias: true,
                },
              },
            },
          },
          asistencias: true, // Solo las asistencias relacionadas con el curso afectado
        },
      });
    */

    // Validamos que `nuevaAsistencia` realmente existe antes de responder
    if (!nuevaAsistencia) {
      await registrarEventoSeguro(request, {
        tabla: "asistencia",
        accion: "ERROR_GET_ASISTENCIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener la nueva asistencia",
        datosAntes: null,
        datosDespues: nuevaAsistencia,
      });

      return generarRespuesta(
        "error",
        "Error, no se encontró el curso afectado",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "asistencia",
        accion: "UPDATE_ASISTENCIA",
        id_objeto: nuevoCargo.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Asistencia actualizada ${validaciones.id_asistencia} y modulo ${validaciones.modulo}`,
        datosAntes: validaciones,
        datosDespues: nuevaAsistencia,
      });

      return generarRespuesta(
        "ok",
        `Modulo ${moduloNumero} validado...`,
        { curso: nuevaAsistencia },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (asitencia): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "asistencia",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al validar asistencia",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (asitencia)", {}, 500);
  }
}
