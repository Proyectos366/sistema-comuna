/**
 @fileoverview Controlador de API para la actualización de una carpeta. Este archivo maneja la lógica
 para editar un registro en la base de datos a través de una solicitud PATCH. Utiliza Prisma para
 la interacción con la base de datos y un sistema de registro de eventos para seguridad.
 @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad en la base de datos.
import validarEditarCarpeta from "@/services/carpetas/validarEditarCarpeta"; // Servicio para validar los datos de entrada de la carpeta.
import procesarDetallesCarpeta from "@/utils/procesarDetallesCarpeta";

/**
 Maneja las solicitudes HTTP PATCH para actualizar una carpeta.
 @async
 @function PATCH
 @param {object} request - El objeto de la solicitud HTTP.
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON.
*/

export async function PATCH(request) {
  try {
    // 1. Obtiene los datos del cuerpo de la solicitud (request)
    const { nombre, descripcion, nivel, seccion, id_carpeta } =
      await request.json();

    // 2. Valida los datos recibidos utilizando el servicio 'validarEditarCarpeta'
    const validaciones = await validarEditarCarpeta(
      nombre,
      descripcion,
      nivel,
      seccion,
      id_carpeta,
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "carpeta",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar una carpeta",
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
    const carpetaActualizada = await prisma.$transaction(async (tx) => {
      // 4.1 Actualiza la carpeta en la base de datos
      // Nota: el alias no se actualiza porque es el identificador de la carpeta física
      const carpeta = await tx.carpeta.update({
        where: {
          id: validaciones.id_carpeta,
          borrado: false,
        },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          nivel: validaciones.nivel,
          seccion: validaciones.seccion,
        },
      });

      // 4.2 Consultar la carpeta actualizado con sus relaciones
      const carpetaUpdated = await tx.carpeta.findUnique({
        where: {
          id: carpeta.id,
          borrado: false,
        },
        include: {
          archivos: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              size: true, // Para sumar el peso
            },
            orderBy: {
              nombre: "asc",
            },
          },
          _count: {
            select: {
              archivos: true, // Única vez que contamos los archivos
            },
          },
        },
      });

      // 4.3. Asegurarnos de que archivos sea un array aunque esté vacío
      const carpetaConArrays = {
        ...carpetaUpdated,
        archivos: carpetaUpdated?.archivos || [],
        _count: carpetaUpdated?._count || { archivos: 0 },
      };

      // 4.4. Calcular el peso total de los archivos
      const pesoTotal = carpetaConArrays.archivos.reduce(
        (suma, archivo) => suma + (archivo.size || 0),
        0,
      );

      // 4.5. Añadir el peso total al objeto
      const carpetaConPeso = {
        ...carpetaConArrays,
        pesoTotal,
      };

      // 4.6. Procesar la carpeta
      const carpetaProcesada = procesarDetallesCarpeta([carpetaConPeso]);

      // 4.7. Retornar el primer elemento
      return carpetaProcesada[0];
    });

    // 5. Condición de error al consultar la carpeta actualizada
    if (!carpetaActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "carpeta",
        accion: "ERROR_UPDATE_CARPETA",
        id_objeto: validaciones.id_carpeta,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la carpeta",
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          nivel: nivel,
          seccion: seccion,
          id_carpeta: id_carpeta,
        },
        datosDespues: carpetaActualizada,
      });

      // Retorna una respuesta de error con un código de estado 400
      return generarRespuesta(
        "error",
        "Error, al consultar la carpeta actualizada",
        {},
        400,
      );
    }

    // 6. Condición de éxito: la carpeta se actualizó correctamente
    await registrarEventoSeguro(request, {
      tabla: "carpeta",
      accion: "UPDATE_CARPETA",
      id_objeto: carpetaActualizada[0]?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Carpeta actualizada con exito id: ${validaciones.id_carpeta}`,
      datosAntes: {
        nombre: nombre,
        descripcion: descripcion,
        nivel: nivel,
        seccion: seccion,
        id_carpeta: id_carpeta,
      },
      datosDespues: carpetaActualizada,
    });

    // 7. Retorna una respuesta de éxito con un código de estado 201 (Update)
    return generarRespuesta(
      "ok",
      "Carpeta actualizada con exito",
      { carpetas: carpetaActualizada },
      201,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno actualizar carpeta: ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "carpeta",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la carpeta",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno actualizar carpeta",
      {},
      500,
    );
  }
}
