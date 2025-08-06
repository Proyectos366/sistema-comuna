import prisma from "@/libs/prisma";
import registrarEventoSeguro from "@/libs/trigget";
import validarVerificarCurso from "@/services/cursos/validarVerificarCurso";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function PATCH(request) {
  try {
    const { id_curso, id_vocero } = await request.json();

    const validaciones = await validarVerificarCurso(id_curso, id_vocero);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "INTENTO_FALLIDO_VERIFICAR_CURSO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: `Validacion fallida al verificar el curso del vocero id: ${validaciones.id_vocero}`,
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

    const verificarCurso = await prisma.curso.update({
      where: {
        id: validaciones.id_curso,
        id_vocero: validaciones.id_vocero,
      },
      data: {
        verificado: true,
        updatedAt: new Date(),
      },
    });

    const nuevaAsistencia = await prisma.curso.findFirst({
      where: { id: verificarCurso.id, borrado: false }, // Filtra solo el curso afectado
      include: {
        voceros: {
          select: {
            id: true,
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

    if (!nuevaAsistencia) {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "ERROR_UPDATE_CURSO",
        id_objeto: validaciones.id_curso,
        id_usuario: validaciones.id_usuario,
        descripcion: `No se pudo verificar el curso id: ${validaciones.id_curso} del vocero id: ${validaciones.id_vocero}`,
        datosAntes: null,
        datosDespues: nuevaAsistencia,
      });
      return generarRespuesta("error", "Error, no se verifico...", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "UPDATE_CURSO",
        id_objeto: nuevaAsistencia?.voceros?.id
          ? nuevaAsistencia?.voceros?.id
          : 0,
        id_usuario: validaciones.id_usuario,
        descripcion: `Se verifico correctamente el curso id: ${validaciones.id_curso} con el vocero ${validaciones.id_vocero}`,
        datosAntes: null,
        datosDespues: nuevaAsistencia,
      });

      return generarRespuesta(
        "ok",
        "Verificado con exito...",
        {
          curso: nuevaAsistencia,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (validar curso): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "curso",
      accion: "ERROR_INTERNO_CURSO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion:
        "Error inesperado al verificar el curso con un vocero determinado",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (validar curso)", {}, 500);
  }
}
