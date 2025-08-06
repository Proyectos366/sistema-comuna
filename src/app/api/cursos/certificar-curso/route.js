import prisma from "@/libs/prisma";
import registrarEventoSeguro from "@/libs/trigget";
import validarCertificarCurso from "@/services/cursos/validarCertificarCurso";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function PATCH(request) {
  try {
    const { id_curso, id_vocero } = await request.json();

    const validaciones = await validarCertificarCurso(id_curso, id_vocero);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "INTENTO_FALLIDO_CERTIFICAR_CURSO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: `Validacion fallida al certificar el curso del vocero id: ${validaciones.id_vocero}`,
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

    const certificandoCurso = await prisma.curso.update({
      where: {
        id: validaciones.id_curso,
        id_vocero: validaciones.id_vocero,
      },
      data: {
        certificado: true,
        fecha_completado: new Date(),
        culminado: true,
      },
    });

    const cursoCertificado = await prisma.curso.findFirst({
      where: { id: certificandoCurso.id, borrado: false }, // Filtra solo el curso afectado
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

    if (!cursoCertificado) {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "ERROR_UPDATE_CURSO",
        id_objeto: validaciones.id_curso,
        id_usuario: validaciones.id_usuario,
        descripcion: `No se pudo certificar el curso id: ${validaciones.id_curso} del vocero id: ${validaciones.id_vocero}`,
        datosAntes: null,
        datosDespues: cursoCertificado,
      });

      return generarRespuesta("error", "Error, no se certifico...", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "UPDATE_CURSO",
        id_objeto: cursoCertificado?.voceros?.id
          ? cursoCertificado?.voceros?.id
          : 0,
        id_usuario: validaciones.id_usuario,
        descripcion: `Se certifico correctamente el curso id: ${validaciones.id_curso} con el vocero ${validaciones.id_vocero}`,
        datosAntes: null,
        datosDespues: cursoCertificado,
      });

      return generarRespuesta(
        "ok",
        "Certificado con exito...",
        {
          curso: cursoCertificado,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (certificar curso): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "curso",
      accion: "ERROR_INTERNO_CURSO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion:
        "Error inesperado al certificar el curso con un vocero determinado",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (certificar curso)",
      {},
      500
    );
  }
}
