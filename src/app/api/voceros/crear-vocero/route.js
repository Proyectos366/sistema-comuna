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

    /**
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
    */

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
          f_n: validaciones.fechaNacimiento,
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

      /**
      if (Array.isArray(formaciones) && formaciones.length > 0) {
        for (const { id: id_formacion } of formaciones) {
          // Crear el curso asociado al vocero
          const curso = await tx.curso.create({
            data: {
              id_vocero: vocero.id,
              id_formacion: id_formacion,
              id_usuario: validaciones.id_usuario,
              verificado: false,
              certificado: false,
            },
          });

          // Obtener los módulos relacionados con la formación
          const modulos = await tx.modulo.findMany({
            where: { id_usuario: validaciones.id_usuario },
          });

          // Crear las asistencias para cada módulo
          for (const modulo of modulos) {
            await tx.asistencia.create({
              data: {
                id_vocero: vocero.id,
                id_modulo: modulo.id,
                id_curso: curso.id,
                id_usuario: validaciones.id_usuario,
                presente: false, // Inicialmente no aprobado
                fecha_registro: new Date(),
              },
            });
          }
        }
      }
 */

      if (Array.isArray(formaciones) && formaciones.length > 0) {
        for (const { id: id_formacion } of formaciones) {
          // Crear el curso asociado al vocero
          const curso = await tx.curso.create({
            data: {
              id_vocero: vocero.id,
              id_formacion: id_formacion,
              id_usuario: validaciones.id_usuario,
              verificado: false,
              certificado: false,
            },
          });

          // Obtener los módulos de la formación actual (filtrando por `id_formacion`)
          const formacionConModulos = await tx.formacion.findUnique({
            where: { id: id_formacion },
            include: {
              modulos: true, // Esto traerá solo los módulos de esta formación
            },
          });

          // Extraer los módulos correctamente
          const modulos = formacionConModulos?.modulos || [];

          // Crear las asistencias solo para los módulos de esta formación
          for (const modulo of modulos) {
            await tx.asistencia.create({
              data: {
                id_vocero: vocero.id,
                id_modulo: modulo.id,
                id_curso: curso.id,
                id_usuario: validaciones.id_usuario,
                presente: false, // Inicialmente no aprobado
                fecha_registro: new Date(),
              },
            });
          }
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
