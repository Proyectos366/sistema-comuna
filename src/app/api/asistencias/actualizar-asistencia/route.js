// Importaciones de módulos y funciones externas.
// prisma es la instancia del ORM para interactuar con la base de datos.
import prisma from "@/libs/prisma";
// generarRespuesta es una utilidad para formatear respuestas HTTP estandarizadas.
import { generarRespuesta } from "@/utils/respuestasAlFront";
// validarAsistenciaPorModulo es un servicio que contiene la lógica de validación de negocio.
import validarAsistenciaPorModulo from "@/services/asistencias/validarAsistenciaPorModulo";
// registrarEventoSeguro es una utilidad para auditar acciones en la aplicación.
import registrarEventoSeguro from "@/libs/trigget";

/**
 * @fileoverview Endpoint de API para validar la asistencia a un módulo de un curso.
 * @description Esta ruta `PATCH` se utiliza para marcar la asistencia de un vocero
 * a un módulo específico como "presente". El proceso incluye la validación de los datos
 * de entrada, la actualización atómica en la base de datos y el registro de eventos de seguridad.
 *
 * @param {Request} request - El objeto de solicitud HTTP, que se espera contenga un cuerpo JSON
 * con los datos necesarios para la validación: `modulo`, `fecha`, `id_asistencia`, y `nombreFormador`.
 * @returns {Promise<Response>} Retorna una `Promise` que resuelve en un objeto `Response` JSON.
 * - Si la operación es exitosa, devuelve un estado `201 Created` y los datos del curso actualizado.
 * - Si hay errores de validación, devuelve un estado `400 Bad Request` con un mensaje descriptivo.
 * - Si ocurre un error interno en el servidor, devuelve un estado `500 Internal Server Error`.
 */
export async function PATCH(request) {
  try {
    // 1. Desestructuración del cuerpo de la solicitud JSON.
    const { modulo, fecha, id_asistencia, nombreFormador } =
      await request.json();

    // 2. Ejecución del servicio de validación para verificar los datos de la asistencia.
    const validaciones = await validarAsistenciaPorModulo(
      modulo,
      fecha,
      id_asistencia,
      nombreFormador
    );

    // 3. Manejo de errores de validación.
    // Si la validación devuelve un estado de 'error', se registra el intento fallido
    // y se retorna una respuesta 400.
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
        400
      );
    }

    // 4. Inicio de una transacción atómica con Prisma.
    // Esto asegura que la actualización de la asistencia y la posterior consulta del curso
    // ocurran sin interrupciones y, si una falla, se deshaga la otra.
    const [moduloEnAsistenciaValidado, nuevaAsistencia] =
      await prisma.$transaction(async (tx) => {
        // a. Actualizar el registro de asistencia en la tabla `asistencia`.
        const asistenciaActualizada = await tx.asistencia.update({
          where: {
            id: validaciones.id_asistencia,
            id_modulo: validaciones.modulo,
          },
          data: {
            presente: true,
            fecha_registro: validaciones.fecha,
            formador: validaciones.nombreFormador,
          },
        });

        // b. Consultar los datos completos del curso relacionado para la respuesta del cliente.
        // Se incluyen los voceros, formaciones, módulos y asistencias para tener
        // una vista completa del estado del curso.
        const cursoRelacionado = await tx.curso.findFirst({
          where: {
            id: asistenciaActualizada.id_curso,
            borrado: false,
          },
          include: {
            voceros: {
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
        400
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
        400
      );
    } else {
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
        { curso: nuevaAsistencia },
        201
      );
    }
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

    return generarRespuesta("error", "Error, interno (asitencia)", {}, 500);
  }
}
