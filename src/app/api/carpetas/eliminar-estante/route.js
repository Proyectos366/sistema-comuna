/**
 @fileoverview Controlador de API para eliminar (o marcar como eliminado) un estante del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de eliminación en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del estante. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/estantes/validarEliminarEstante
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEliminarEstante from "@/services/estantes/validarEliminarEstante"; // Servicio para validar la eliminación del estante
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría
import procesarDetallesEstante from "@/utils/procesarDetallesEstante";

/**
 Maneja las solicitudes HTTP PATCH para eliminar (lógicamente) un estante.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del estante.
 
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de eliminación y el ID del estante.
 @returns {Promise<Response>} Respuesta HTTP con el estante actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_estante } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarEliminarEstante(estado, id_estante);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "estante",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar el estante",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.codigo ? validaciones.codigo : 400,
      );
    }

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta el estante actualizado
    const estanteActualizado = await prisma.$transaction(async (tx) => {
      // 4.1 Actualiza el estado de eliminación del estante
      const estante = await tx.estante.update({
        where: {
          id: validaciones.id_estante,
        },
        data: {
          borrado: validaciones.borrado,
        },
      });

      // 4.2 Consultar el estante actualizado con sus relaciones
      const estanteConsultado = await tx.estante.findUnique({
        where: {
          id: estante.id,
        },
        include: {
          carpetas: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              nivel: true,
              seccion: true,
              _count: {
                select: {
                  archivos: true,
                },
              },
            },
            orderBy: {
              nombre: "asc",
            },
          },
          archivos: {
            select: {
              id: true,
              size: true,
            },
          },
          _count: {
            select: {
              carpetas: true,
              archivos: true,
            },
          },
        },
      });

      // 4.3 Asegurarnos de que carpetas sea un array aunque esté vacío
      const estanteConCarpetasArray = {
        ...estanteConsultado,
        carpetas: estanteConsultado?.carpetas || [],
        archivos: estanteConsultado?.archivos || [],
        _count: estanteConsultado?._count || { carpetas: 0, archivos: 0 },
      };

      // 4.4 Procesar el estante individual
      const estanteProcesado = procesarDetallesEstante([
        estanteConCarpetasArray,
      ]);

      // 4.5 Retornar el primer elemento
      return estanteProcesado[0];
    });

    // 5. Si no se obtiene el estante o la actualización falla, registra el error y retorna
    if (!estanteActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "estante",
        accion: "ERROR_DELETE_ESTANTE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar el estante",
        datosAntes: null,
        datosDespues: {
          eliminandoEstante,
          estanteActualizado,
        },
      });

      return generarRespuesta("error", "Error, al eliminar estante", {}, 400);
    }

    // 6. Registro exitoso del evento y retorno del estante actualizado
    await registrarEventoSeguro(request, {
      tabla: "estante",
      accion: "DELETE_ESTANTE",
      id_objeto: estanteActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Estante eliminado con exito",
      datosAntes: null,
      datosDespues: {
        estanteActualizado,
      },
    });

    // 7. Retorna una respuesta exitosa con el estante actualizado
    return generarRespuesta(
      "ok",
      "Estante eliminado correctamente",
      {
        estantes: estanteActualizado,
      },
      200,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (eliminar estante): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "estante",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_estante: 0,
      descripcion: "Error inesperado al eliminar estante",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (eliminar estante)",
      {},
      500,
    );
  }
}
