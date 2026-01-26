/**
  @fileoverview Controlador de API para la validacion de un modulo en asistencias. Este archivo
  maneja la lógica para actualizar las asitencias por modulo en la base de datos a través
  de una solicitud PATCH. Utiliza Prisma para la interacción con la base de datos, un servicio de
  validación para asegurar la validez de los datos, y un sistema de registro de eventos para la
  auditoría. @module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarAsistenciaPorModulo from "@/services/asistencias/validarAsistenciaPorModulo"; // registrarEventoSeguro es una utilidad para auditar acciones en la aplicación.

/**
  Maneja las solicitudes HTTP PATCH para validar un modulo.
  @async@function PATCH
  @param {Request} request - Objeto de la solicitud que contiene los detalles del modulo.
  @returns Promise - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function PATCH(request) {
  try {
    // 1. Desestructuración del cuerpo de la solicitud JSON.
    const { modulo, fecha, id_asistencia, id_formador, descripcion } =
      await request.json();

    // 2. Ejecución del servicio de validación para verificar los datos de la asistencia.
    const validaciones = await validarAsistenciaPorModulo(
      modulo,
      fecha,
      id_asistencia,
      id_formador,
      descripcion,
    );

    // 3. Manejo de errores de validación.

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
        400,
      );
    }

    // 4. Inicio de una transacción atómica con Prisma.
    const [moduloEnAsistenciaValidado, nuevaAsistencia] =
      await prisma.$transaction(async (tx) => {
        const asistenciaActualizada = await tx.asistencia.update({
          where: {
            id: validaciones.id_asistencia,
            id_modulo: validaciones.modulo,
          },
          data: {
            presente: true,
            fecha_validada: validaciones.fecha,
            id_formador: validaciones.id_formador,
            id_validador: validaciones.id_usuario,
            descripcion: validaciones.descripcion,
          },
        });

        // b. Consultar los datos completos del curso relacionado para la respuesta del cliente.
        const cursoRelacionado = await tx.curso.findFirst({
          where: {
            id: asistenciaActualizada.id_curso,
            borrado: false,
          },
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

        // Se retornan ambos objetos para que puedan ser usados después de la transacción.
        return [asistenciaActualizada, cursoRelacionado];
      });

    // 5. Verificación post-transacción.
    // Se valida que la actualización haya ocurrido correctamente.
    if (!moduloEnAsistenciaValidado) {
      await registrarEventoSeguro(request, {
        tabla: "asistencia",
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
        400,
      );
    }

    // 6. Verificación de la obtención del curso relacionado.
    // Se asegura que el curso se haya encontrado antes de responder.
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
        400,
      );
    }

    // 7. Registro de evento de éxito y retorno de la respuesta final.
    await registrarEventoSeguro(request, {
      tabla: "asistencia",
      accion: "UPDATE_ASISTENCIA",
      id_objeto: nuevaAsistencia.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Asistencia actualizada ${validaciones.id_asistencia} y modulo ${validaciones.modulo}`,
      datosAntes: validaciones,
      datosDespues: nuevaAsistencia,
    });

    return generarRespuesta(
      "ok",
      `Modulo ${validaciones.modulo} validado...`,
      { participantes: nuevaAsistencia },
      201,
    );
  } catch (error) {
    console.log(`Error interno (asitencia): ` + error);

    // 8. Bloque catch para errores inesperados.
    // Registra cualquier error no manejado previamente y retorna un error genérico 500.
    await registrarEventoSeguro(request, {
      tabla: "asistencia",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al validar asistencia",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (asitencia)", {}, 500);
  }
}
