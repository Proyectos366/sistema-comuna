/**
 @fileoverview Controlador de API para editar un vocero existente en el sistema. Este endpoint recibe
 los datos actualizados del vocero, valida la información, realiza la actualización en la base de
 datos y registra eventos de auditoría. Utiliza Prisma como ORM, servicios personalizados para
 validación y registro seguro de eventos. @module api/voceros/editarVocero
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEditarVocero from "@/services/voceros/validarEditarVocero"; // Servicio para validar los datos del vocero
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP POST para editar un vocero.
 * Valida los datos recibidos, actualiza el vocero en la base de datos y retorna una respuesta estructurada.
 *
 * @async
 * @function POST
 * @param {Request} request - Solicitud HTTP con los datos del vocero a editar.
 * @returns {Promise<Response>} Respuesta HTTP con el vocero actualizado o un mensaje de error.
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

    // 3. Si la validación falla, registra el intento y retorna error
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

    // 4. Ejecuta la actualización y consulta del vocero en una transacción
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
      }),
    ]);

    // 5. Verifica si se obtuvo el vocero actualizado
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
    }

    // 6. Registra el evento exitoso de actualización
    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "UPDATE_VOCERO",
      id_objeto: voceroActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Vocero actualizado con exito`,
      datosAntes: validaciones,
      datosDespues: voceroActualizado,
    });

    // 7. Retorna la respuesta exitosa con el vocero actualizado
    return generarRespuesta(
      "ok",
      "Vocero actualizado...",
      { vocero: voceroActualizado },
      201
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
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

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar vocero)",
      {},
      500
    );
  }
}
