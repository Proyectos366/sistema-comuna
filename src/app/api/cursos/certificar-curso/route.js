/**
  @fileoverview Controlador de API para certificar un curso.Este archivo maneja la lógica para
  certificar un curso asociado a un voceroa través de una solicitud PATCH.Utiliza Prisma para
  la interacción con la base de datos, un servicio de validaciónpara asegurar la validez de
  los datos, y un sistema de registro de eventos para la auditoría.
  @module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarCertificarCurso from "@/services/cursos/validarCertificarCurso"; // Servicio para validar la solicitud de certificación del curso.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.

/**
  Maneja las solicitudes HTTP PATCH para certificar un curso.
  @async@function PATCH
  @param {Request} request - Objeto de la solicitud que contiene el ID del curso y del vocero a certificar.
  @returns Promise - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { id_curso, id_vocero, descripcion } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCertificarCurso(
      id_curso,
      id_vocero,
      descripcion,
    );

    // 3. Condición de validación fallida
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
        400,
      );
    }

    // 4. Actualiza el curso para certificarlo
    const certificandoCurso = await prisma.curso.update({
      where: {
        id: validaciones.id_curso,
        id_vocero: validaciones.id_vocero,
      },
      data: {
        certificado: true,
        culminado: true,
        fecha_certificado: new Date(),
        id_certifico: validaciones.id_usuario,
        descripcion: validaciones.descripcion,
      },
    });

    // 5. Consulta el curso certificado junto con información relevante
    const participanteCursoFormacionCertificado = await prisma.curso.findFirst({
      where: { borrado: false, id: certificandoCurso.id },
      include: {
        voceros: {
          select: {
            id: true,
            cedula: true,
            edad: true,
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            genero: true,
            telefono: true,
            correo: true,
            f_n: true,
            laboral: true,
            createdAt: true,
            comunas: {
              select: {
                id: true,
                nombre: true, // Trae el nombre de la comuna
              },
            },
            consejos: {
              select: {
                id: true,
                nombre: true,
              },
            },
            circuitos: {
              select: {
                id: true,
                nombre: true,
              },
            },
            parroquias: {
              select: {
                id: true,
                nombre: true,
              },
            },
            cargos: {
              select: { id: true, nombre: true },
            },
          },
        },
        formaciones: {
          include: {
            modulos: {
              include: {
                asistencias: true, // Relaciona módulos con asistencias
              },
            },
          },
        },
        asistencias: true,
      },
    });

    // 6. Condición de error si no se obtuvo el curso certificado
    if (!participanteCursoFormacionCertificado) {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "ERROR_UPDATE_CURSO",
        id_objeto: validaciones.id_curso,
        id_usuario: validaciones.id_usuario,
        descripcion: `No se pudo certificar el curso id: ${validaciones.id_curso} del vocero id: ${validaciones.id_vocero}`,
        datosAntes: null,
        datosDespues: participanteCursoFormacionCertificado,
      });

      return generarRespuesta("error", "Error, no se certifico...", {}, 400);
    }

    // 7. Condición de éxito: el curso fue certificado correctamente
    await registrarEventoSeguro(request, {
      tabla: "curso",
      accion: "UPDATE_CURSO",
      id_objeto: participanteCursoFormacionCertificado?.voceros?.id
        ? participanteCursoFormacionCertificado?.voceros?.id
        : 0,
      id_usuario: validaciones.id_usuario,
      descripcion: `Se certifico correctamente el curso id: ${validaciones.id_curso} con el vocero ${validaciones.id_vocero}`,
      datosAntes: null,
      datosDespues: participanteCursoFormacionCertificado,
    });

    // 8. Retorna una respuesta de exito
    return generarRespuesta(
      "ok",
      "Certificado con exito...",
      {
        participantes: participanteCursoFormacionCertificado,
      },
      201,
    );
  } catch (error) {
    // 9. Manejo de errores inesperados
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

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (certificar curso)",
      {},
      500,
    );
  }
}
