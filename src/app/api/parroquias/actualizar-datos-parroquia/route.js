/**
 @fileoverview Controlador de API para actualizar una parroquia existente. Este endpoint maneja la
 lógica de validación, actualización en la base de datos, registro de eventos y respuesta
 estandarizada al cliente. Utiliza Prisma como ORM, y servicios personalizados para validación y
 auditoría. @module api/parroquias/editar
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría
import validarEditarParroquia from "@/services/parroquias/validarEditarParroquia"; // Servicio para validar datos de edición

/**
 Maneja las solicitudes HTTP POST para editar una parroquia. Valida los datos recibidos, actualiza
 la parroquia en la base de datos, registra eventos de auditoría y retorna una respuesta estandarizada.
 * @async
 * @function POST
 * @param {Request} request - Objeto de solicitud HTTP con los datos en formato JSON.
 * @returns {Promise<Response>} Respuesta HTTP con el resultado de la operación.
*/

export async function POST(request) {
  try {
    // 1. Extrae los datos enviados en el cuerpo de la solicitud
    const {
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia,
    } = await request.json();

    // 2. Valida los datos antes de proceder con la actualización
    const validaciones = await validarEditarParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "INTENTO_FALLIDO_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar la parroquia",
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

    // 4. Ejecuta la transacción: actualiza la parroquia y la consulta actualizada
    const [actualizado, parroquiaActualizada] = await prisma.$transaction([
      prisma.parroquia.update({
        where: { id: validaciones.id_parroquia },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.parroquia.findFirst({
        where: {
          id: validaciones.id_parroquia,
          borrado: false,
        },
      }),
    ]);

    // 5. Consulta todos los países con su estructura jerárquica
    const todosPaises = await prisma.pais.findMany({
      where: {
        borrado: false,
      },
      include: {
        estados: {
          include: {
            municipios: {
              include: {
                parroquias: true,
              },
            },
          },
        },
      },
    });

    // 6. Si no se encuentra la parroquia actualizada, registra el error y responde
    if (!parroquiaActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "ERROR_UPDATE_PARROQUIA",
        id_objeto: validaciones.id_parroquia,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la parroquia",
        datosAntes: {
          nombre,
          descripcion,
          id_pais,
          id_estado,
          id_municipio,
          id_parroquia,
        },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, no se actualizado la parroquia",
        {},
        400
      );
    }

    // 7. Registro exitoso de la actualización
    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "UPDATE_PARROQUIA",
      id_objeto: parroquiaActualizada?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Parroquia actualizada con exito id: ${validaciones.id_parroquia}`,
      datosAntes: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        id_pais: validaciones.id_pais,
        id_estado: validaciones.id_estado,
        id_municipio: validaciones.id_municipio,
        id_parroquia: validaciones.id_parroquia,
      },
      datosDespues: parroquiaActualizada,
    });

    return generarRespuesta(
      "ok",
      "Parroquia actualizada...",
      { parroquias: parroquiaActualizada, paises: todosPaises },
      201
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (actualizar parroquia): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la parroquia",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar parroquia)",
      {},
      500
    );
  }
}
