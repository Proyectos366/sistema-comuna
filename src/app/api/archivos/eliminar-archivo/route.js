/**
 @fileoverview Controlador de API para eliminar (o marcar como eliminado) un archivo del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de eliminación en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del archivo. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/archivos/validarEliminarArchivo
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEliminarArchivo from "@/services/archivos/validarEliminarArchivo"; // Servicio para validar la eliminación del archivo
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para eliminar (lógicamente) un archivo.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del archivo.
 
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de eliminación y el ID del archivo.
 @returns {Promise<Response>} Respuesta HTTP con el archivo actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_archivo } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarEliminarArchivo(estado, id_archivo);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "archivo",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar el archivo",
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

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta el archivo actualizado
    const archivoActualizado = await prisma.$transaction(async (tx) => {
      // 4.1 Actualiza el estado de eliminación del archivo
      const archivo = await tx.archivo.update({
        where: {
          id: validaciones.id_archivo,
        },
        data: {
          borrado: validaciones.borrado,
        },
      });

      // 4.2 Consultar el archivo actualizada con sus relaciones
      const archivoConsultado = await tx.archivo.findUnique({
        where: {
          id: archivo.id,
        },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          alias: true,
          nombre_original: true,
          nombre_sistema: true,
          codigo: true,
          hash: true,
          extension: true,
          tipo: true,
          size: true,
          borrado: true,
          createdAt: true,
        },
      });

      // 4.3. Retornar el primer elemento
      return archivoConsultado;
    });

    // 5. Si no se obtiene el archivo o la actualización falla, registra el error y retorna
    if (!archivoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "archivo",
        accion: "ERROR_DELETE_ARCHIVO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar el archivo",
        datosAntes: null,
        datosDespues: {
          archivoActualizado,
        },
      });

      return generarRespuesta("error", "Error, al eliminar archivo", {}, 400);
    }

    // 6. Registro exitoso del evento y retorno del archivo actualizado
    await registrarEventoSeguro(request, {
      tabla: "archivo",
      accion: "DELETE_ARCHIVO",
      id_objeto: archivoActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Archivo eliminado con exito",
      datosAntes: null,
      datosDespues: {
        archivoActualizado,
      },
    });

    // 7. Retorna una respuesta exitosa con el archivo actualizado
    return generarRespuesta(
      "ok",
      "Archivo eliminado correctamente",
      {
        archivos: archivoActualizado,
      },
      200,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno eliminar archivo: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "archivo",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_archivo: 0,
      descripcion: "Error inesperado al eliminar archivo",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error interno eliminar archivo", {}, 500);
  }
}
