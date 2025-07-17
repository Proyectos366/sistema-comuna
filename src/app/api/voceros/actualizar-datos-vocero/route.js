import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarEditarVocero from "@/services/validarEditarUsuario";

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
      return generarRespuesta(
        "error",
        "Error, al consultar vocero actualizado",
        {},
        400
      );
    }

    return generarRespuesta(
      "ok",
      "Vocero actualizado...",
      { vocero: voceroActualizado },
      201
    );
  } catch (error) {
    console.log(`Error interno (actualizar vocero): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno (actualizar vocero)",
      {},
      500
    );
  }
}
