/**
 @fileoverview Controlador de API para crear un nuevo vocero en el sistema. Este endpoint recibe los
 datos del vocero, valida la información, registra el vocero en la base de datos y crea los cursos y
 asistencias correspondientes. También registra eventos de auditoría para cada acción. Utiliza Prisma
 como ORM y servicios personalizados para validación y trazabilidad. @module api/voceros/crearVocero
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarCrearVocero from "@/services/voceros/validarCrearVocero"; // Servicio para validar los datos del vocero
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP POST para crear un nuevo vocero.
 * Valida los datos recibidos, crea el vocero, cursos y asistencias, y retorna una respuesta estructurada.
 *
 * @async
 * @function POST
 * @param {Request} request - Solicitud HTTP con los datos del vocero a registrar.
 * @returns {Promise<Response>} Respuesta HTTP con el vocero creado o un mensaje de error.
 */

export async function POST(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
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

    // 2. Valida los datos recibidos
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

    // 3. Si la validación falla, registra el intento y retorna error
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar crear vocero",
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

    // 4. Crea el vocero dentro de una transacción atomica
    const vocero = await prisma.$transaction(async (tx) => {
      return await tx.vocero.create({
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
    });

    // 5. Crea cursos y asistencias si hay formaciones asociadas
    if (Array.isArray(formaciones) && formaciones.length > 0) {
      for (const { id: id_formacion } of formaciones) {
        const curso = await prisma.curso.create({
          data: {
            id_vocero: vocero.id,
            id_formacion: id_formacion,
            id_usuario: validaciones.id_usuario,
            verificado: false,
            certificado: false,
          },
        });

        await registrarEventoSeguro(request, {
          tabla: "curso",
          accion: "CREAR_CURSO",
          id_objeto: curso.id,
          id_usuario: validaciones.id_usuario,
          descripcion: `Curso creado para formación ID ${id_formacion} y vocero ID ${vocero.id}`,
          datosAntes: null,
          datosDespues: curso,
        });

        const formacionConModulos = await prisma.formacion.findUnique({
          where: { id: id_formacion },
          include: { modulos: true },
        });

        await registrarEventoSeguro(request, {
          tabla: "formacion",
          accion: "GET_FORMACION",
          id_objeto: id_formacion,
          id_usuario: validaciones.id_usuario,
          descripcion: `Formación obtenida con ${
            formacionConModulos?.modulos.length || 0
          } módulo(s)`,
          datosAntes: null,
          datosDespues: formacionConModulos,
        });

        const modulos = formacionConModulos?.modulos || [];

        for (const modulo of modulos) {
          const asistenciaCreada = await prisma.asistencia.create({
            data: {
              id_vocero: vocero.id,
              id_modulo: modulo.id,
              id_curso: curso.id,
              id_usuario: validaciones.id_usuario,
              presente: false,
              fecha_registro: new Date(),
            },
          });

          await registrarEventoSeguro(request, {
            tabla: "asistencia",
            accion: "CREAR_ASISTENCIA",
            id_objeto: asistenciaCreada.id,
            id_usuario: validaciones.id_usuario,
            descripcion: `Asistencia registrada para módulo ${modulo.nombre}, curso ID ${curso.id}`,
            datosAntes: null,
            datosDespues: asistenciaCreada,
          });
        }
      }
    }

    // 6. Consulta el vocero recién creado para retornar sus datos completos
    const nuevoVoceroCreado = await prisma.vocero.findFirst({
      where: { cedula: validaciones.cedula, borrado: false },
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
                formador: true,
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
    });

    // 7. Verifica si se obtuvo el vocero creado correctamente
    if (!nuevoVoceroCreado) {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "ERROR_CREAR_VOCERO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el vocero",
        datosAntes: null,
        datosDespues: nuevoVoceroCreado,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo el vocero...",
        {},
        400
      );
    }

    // 8. Registra el evento exitoso de creación
    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "CREAR_VOCERO",
      id_objeto: nuevoVoceroCreado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Vocero creado con exito`,
      datosAntes: null,
      datosDespues: nuevoVoceroCreado,
    });

    // 9. Retorna la respuesta exitosa con el vocero creado
    return generarRespuesta(
      "ok",
      "Vocero creado...",
      {
        vocero: nuevoVoceroCreado,
      },
      201
    );
  } catch (error) {
    // 10. Manejo de errores inesperados
    console.log(`Error interno (crear vocero): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear vocero",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (crear vocero)", {}, 500);
  }
}
