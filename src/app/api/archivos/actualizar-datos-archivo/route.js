/**
 @fileoverview Controlador de API para la actualización de un archivo. Este archivo maneja la lógica
 para editar un registro en la base de datos a través de una solicitud PATCH. Utiliza Prisma para
 la interacción con la base de datos y un sistema de registro de eventos para seguridad.
 @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad en la base de datos.
import validarEditarArchivo from "@/services/archivos/validarEditarArchivo"; // Servicio para validar los datos de entrada del archivo.

/**
 Maneja las solicitudes HTTP PATCH para actualizar un archivo.
 @async
 @function PATCH
 @param {object} request - El objeto de la solicitud HTTP.
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON.
*/

export async function PATCH(request) {
  try {
    // 1. Obtiene los datos del cuerpo de la solicitud (request)
    const { nombre, descripcion, id_archivo } = await request.json();

    // 2. Valida los datos recibidos utilizando el servicio 'validarEditarArchivo'
    const validaciones = await validarEditarArchivo(
      nombre,
      descripcion,
      id_archivo,
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "archivo",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar un archivo",
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

    // 4. Inicia una transacción de Prisma para asegurar la integridad de los datos
    const archivoActualizado = await prisma.$transaction(async (tx) => {
      // 4.1 Actualiza el archivo en la base de datos
      // Nota: el alias no se actualiza porque es como una firma casi que unica
      const archivo = await tx.archivo.update({
        where: {
          id: validaciones.id_archivo,
          borrado: false,
        },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      });

      // 4.2 Consultar el archivo actualizado con sus relaciones
      const archivoUpdated = await tx.archivo.findUnique({
        where: {
          id: archivo.id,
          borrado: false,
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

      return archivoUpdated;
    });

    // 5. Condición de error al consultar el archivo actualizado
    if (!archivoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "archivo",
        accion: "ERROR_UPDATE_ARCHIVO",
        id_objeto: validaciones.id_archivo,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el archivo",
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          id_archivo: id_archivo,
        },
        datosDespues: archivoActualizado,
      });

      // Retorna una respuesta de error con un código de estado 400
      return generarRespuesta(
        "error",
        "Error, al consultar el archivo actualizado",
        {},
        400,
      );
    }

    // 6. Condición de éxito: el archivo se actualizó correctamente
    await registrarEventoSeguro(request, {
      tabla: "archivo",
      accion: "UPDATE_ARCHIVO",
      id_objeto: archivoActualizado[0]?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Archivo actualizado con exito id: ${validaciones.id_archivo}`,
      datosAntes: {
        nombre: nombre,
        descripcion: descripcion,
        id_archivo: id_archivo,
      },
      datosDespues: archivoActualizado,
    });

    // 7. Retorna una respuesta de éxito con un código de estado 201 (Update)
    return generarRespuesta(
      "ok",
      "Archivo actualizado con exito",
      { archivos: archivoActualizado },
      201,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno actualizar archivo: ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "archivo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el archivo",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno actualizar archivo",
      {},
      500,
    );
  }
}
