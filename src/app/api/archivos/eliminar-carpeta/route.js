/**
 @fileoverview Controlador de API para eliminar (o marcar como eliminada) una carpeta del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de eliminación en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado de la carpeta. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/carpetas/validarEliminarCarpeta
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEliminarCarpeta from "@/services/carpetas/validarEliminarCarpeta"; // Servicio para validar la eliminación dla carpeta
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría
import procesarDetallesCarpeta from "@/utils/procesarDetallesCarpeta";

/**
 Maneja las solicitudes HTTP PATCH para eliminar (lógicamente) una carpeta.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado de la carpeta.
 
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de eliminación y el ID de la carpeta.
 @returns {Promise<Response>} Respuesta HTTP con la carpeta actualizada o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_carpeta } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarEliminarCarpeta(estado, id_carpeta);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "carpeta",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar la carpeta",
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

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta la carpeta actualizada
    const carpetaActualizada = await prisma.$transaction(async (tx) => {
      // 4.1 Actualiza el estado de eliminación de la carpeta
      const carpeta = await tx.carpeta.update({
        where: {
          id: validaciones.id_carpeta,
        },
        data: {
          borrado: validaciones.borrado,
        },
      });

      // 4.2 Consultar la carpeta actualizada con sus relaciones
      const carpetaConsultada = await tx.carpeta.findUnique({
        where: {
          id: carpeta.id,
        },
        include: {
          archivos: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              size: true,
            },
            orderBy: {
              nombre: "asc",
            },
          },
          _count: {
            select: {
              archivos: true,
            },
          },
        },
      });

      // 4.3 Asegurarnos de que archivos sea un array aunque esté vacío
      const carpetaConArrays = {
        ...carpetaConsultada,
        archivos: carpetaConsultada?.archivos || [],
        _count: carpetaConsultada?._count || { archivos: 0 },
      };

      // 4.4 Calcular el peso total de los archivos
      const pesoTotal = carpetaConArrays.archivos.reduce(
        (suma, archivo) => suma + (archivo.size || 0),
        0,
      );

      // 4.5 Añadir el peso total al objeto
      const carpetaConPeso = {
        ...carpetaConArrays,
        pesoTotal,
      };

      // 5.7. Procesar la carpeta
      const carpetaProcesada = procesarDetallesCarpeta([carpetaConPeso]);

      // 5.8. Retornar el primer elemento
      return carpetaProcesada[0];
    });

    // 5. Si no se obtiene la carpeta o la actualización falla, registra el error y retorna
    if (!carpetaActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "carpeta",
        accion: "ERROR_DELETE_CARPETA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar la carpeta",
        datosAntes: null,
        datosDespues: {
          eliminandocarpeta,
          carpetaActualizada,
        },
      });

      return generarRespuesta("error", "Error, al eliminar carpeta", {}, 400);
    }

    // 6. Registro exitoso del evento y retorno dla carpeta actualizado
    await registrarEventoSeguro(request, {
      tabla: "carpeta",
      accion: "DELETE_CARPETA",
      id_objeto: carpetaActualizada.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Carpeta eliminada con exito",
      datosAntes: null,
      datosDespues: {
        carpetaActualizada,
      },
    });

    // 7. Retorna una respuesta exitosa con la carpeta actualizado
    return generarRespuesta(
      "ok",
      "Carpeta eliminada correctamente",
      {
        carpetas: carpetaActualizada,
      },
      200,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (eliminar carpeta): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "carpeta",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_carpeta: 0,
      descripcion: "Error inesperado al eliminar carpeta",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (eliminar carpeta)",
      {},
      500,
    );
  }
}
