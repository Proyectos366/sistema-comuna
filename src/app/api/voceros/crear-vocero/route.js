import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearVocero from "@/services/validarCrearVocero";

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
      pertenece,
    } = await request.json();

    const validaciones = await validarCrearVocero(
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

    const nuevoVocero = await prisma.$transaction(async (tx) => {
      const vocero = await tx.vocero.create({
        data: {
          nombre: validaciones.nombre,
          nombre_dos: validaciones.nombreDos,
          apellido: validaciones.apellido,
          apellido_dos: validaciones.apellidoDos,
          cedula: validaciones.cedula,
          genero: validaciones.genero,
          edad: validaciones.edad,
          telefono: validaciones.telefono,
          direccion: validaciones.direccion,
          correo: validaciones.correo,
          token: validaciones.token,
          laboral: validaciones.laboral,
          borrado: false,
          id_usuario: validaciones.id_usuario,
          id_comuna: validaciones.id_comuna,
          id_consejo: validaciones.id_consejo,
          id_circuito: validaciones.id_circuito,
          id_parroquia: validaciones.id_parroquia,
          cargos: {
            connect: cargos.map(({ id }) => ({ id })),
          },
        },
      });

      if (Array.isArray(formaciones) && formaciones.length > 0) {
        for (const { id: id } of formaciones) {
          await tx.curso.create({
            data: {
              id_vocero: vocero.id,
              id_formacion: id,
              id_usuario: validaciones.id_usuario,
              verificado: false,
              certificado: false,
            },
          });
        }
      }

      return vocero;
    });

    //const nuevoVocero = false;

    if (!nuevoVocero) {
      return generarRespuesta(
        "error",
        "Error, no se creo el vocero...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Vocero creado...",
        {
          vocero: nuevoVocero,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (crear vocero): ` + error);

    return generarRespuesta("error", "Error, interno (crear vocero)", {}, 500);
  }
}
