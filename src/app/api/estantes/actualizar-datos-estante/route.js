/**
 @fileoverview Controlador de API para la actualización de un estante. Este archivo maneja la lógica
 para editar un registro en la base de datos a través de una solicitud PATCH. Utiliza Prisma para
 la interacción con la base de datos y un sistema de registro de eventos para seguridad.
 @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad en la base de datos.
import validarEditarEstante from "@/services/estantes/validarEditarEstante"; // Servicio para validar los datos de entrada del estante.
import procesarDetallesEstante from "@/utils/procesarDetallesEstante";

/**
 Maneja las solicitudes HTTP PATCH para actualizar un estante.
 @async
 @function PATCH
 @param {object} request - El objeto de la solicitud HTTP.
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON.
*/

export async function PATCH(request) {
  try {
    // 1. Obtiene los datos del cuerpo de la solicitud (request)
    const { nombre, descripcion, niveles, secciones, cabecera, id_estante } =
      await request.json();

    // 2. Valida los datos recibidos utilizando el servicio 'validarEditarEstante'
    const validaciones = await validarEditarEstante(
      nombre,
      descripcion,
      niveles,
      secciones,
      cabecera,
      id_estante,
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "estante",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar el estante",
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

    // 4. Inicia una transacción de Prisma para asegurar la integridad de los datos
    const estanteActualizado = await prisma.$transaction(async (tx) => {
      // 4.1 Actualiza el estante en la base de datos
      const estante = await tx.estante.update({
        where: {
          id: validaciones.id_estante,
          borrado: false,
        },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          nivel: validaciones.niveles,
          seccion: validaciones.secciones,
          cabecera: validaciones.cabecera,
          // Nota: el alias no se actualiza porque es el identificador de la carpeta física
        },
      });

      // 4.2 Consultar el estante actualizado con sus relaciones
      const estanteCreado = await tx.estante.findUnique({
        where: {
          id: estante.id,
          borrado: false,
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
        ...estanteCreado,
        carpetas: estanteCreado?.carpetas || [],
        archivos: estanteCreado?.archivos || [],
        _count: estanteCreado?._count || { carpetas: 0, archivos: 0 },
      };

      // 4.4 Procesar el estante individual
      const estanteProcesado = procesarDetallesEstante([
        estanteConCarpetasArray,
      ]);

      // 4.5 Retornar el primer elemento
      return estanteProcesado[0];
    });

    // 5. Condición de error al consultar el estante actualizado
    if (!estanteActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "estante",
        accion: "ERROR_UPDATE_ESTANTE",
        id_objeto: validaciones.id_estante,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el estante",
        datosAntes: { nombre, descripcion, id_estante },
        datosDespues: actualizado,
      });

      // Retorna una respuesta de error con un código de estado 400
      return generarRespuesta(
        "error",
        "Error, al consultar el estante actualizado",
        {},
        400,
      );
    }

    // 6. Condición de éxito: el estante se actualizó correctamente
    await registrarEventoSeguro(request, {
      tabla: "estante",
      accion: "UPDATE_ESTANTE",
      id_objeto: estanteActualizado[0]?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Estante actualizado con exito id: ${validaciones.id_estante}`,
      datosAntes: {
        nombre: nombre,
        descripcion: descripcion,
        id_estante: id_estante,
      },
      datosDespues: estanteActualizado,
    });

    // 7. Retorna una respuesta de éxito con un código de estado 201 (Update)
    return generarRespuesta(
      "ok",
      "Estante actualizado",
      { estantes: estanteActualizado },
      201,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno actualizar estante: ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "estante",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el estante",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno actualizar estante",
      {},
      500,
    );
  }
}
