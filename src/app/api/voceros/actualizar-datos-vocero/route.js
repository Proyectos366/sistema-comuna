import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarEditarVocero from "@/services/validarEditarVocero";
import registrarEventoSeguro from "@/libs/trigget";

export async function POST(request) {
  try {
    const {
      nombre,
      nombre_dos,
      apellido,
      apellido_dos,
      cedula,
      correo,
      genero,
      edad,
      telefono,
      direccion,
      laboral,
      cargos,
      formaciones,
      id_parroquia,
      id_comuna,
      id_consejo,
      id_circuito,
    } = await request.json();

    const validaciones = await validarEditarVocero(
      nombre,
      nombre_dos,
      apellido,
      apellido_dos,
      cedula,
      correo,
      genero,
      edad,
      telefono,
      direccion,
      laboral,
      id_parroquia,
      id_comuna,
      id_consejo,
      id_circuito
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar vocero",
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

    const [actualizado, voceroActualizado] = await prisma.$transaction([
      prisma.vocero.update({
        where: { cedula: validaciones.cedula },
        data: {
          nombre: validaciones.nombre,
          nombre_dos: validaciones.nombreDos,
          apellido: validaciones.apellido,
          apellido_dos: validaciones.apellidoDos,
          correo: validaciones.correo,
          genero: validaciones.genero,
          edad: validaciones.edad,
          telefono: validaciones.telefono,
          direccion: validaciones.direccion,
          laboral: validaciones.laboral,
          id_parroquia: validaciones.id_parroquia,
          id_comuna: validaciones.id_comuna,
          id_consejo: validaciones.id_consejo,
          id_circuito: validaciones.id_circuito,
          cargos: {
            set: cargos.map(({ id }) => ({ id })),
          },
        },
      }),

      prisma.vocero.findUnique({
        where: { cedula: validaciones.cedula },
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
          laboral: true,
          comunas: { select: { nombre: true, id: true, id_parroquia: true } },
          circuitos: { select: { nombre: true, id: true } },
          parroquias: { select: { nombre: true } },
          consejos: { select: { nombre: true } },
          cursos: {
            where: { borrado: false },
            select: {
              verificado: true,
              certificado: true,
              formaciones: { select: { nombre: true } },
              asistencias: {
                select: {
                  id: true,
                  presente: true,
                  fecha_registro: true,
                  modulos: { select: { id: true, nombre: true } },
                },
              },
            },
          },
          cargos: {
            select: { nombre: true, id: true },
          },
        },
      }),
    ]);

    if (!voceroActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "ERROR_UPDATE_VOCERO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el vocero",
        datosAntes: validaciones,
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar vocero actualizado",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "UPDATE_VOCERO",
        id_objeto: voceroActualizado.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Vocero actualizado con exito`,
        datosAntes: validaciones,
        datosDespues: voceroActualizado,
      });

      return generarRespuesta(
        "ok",
        "Vocero actualizado...",
        { vocero: voceroActualizado },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar vocero): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el vocero",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar vocero)",
      {},
      500
    );
  }
}
