/**
  @fileoverview Controlador de API para la edición de un circuito existente. Este archivo maneja la
  lógica para actualizar los detalles de un circuito en la base de datos a través de una solicitud PATCH.
  Utiliza Prisma para la interacción con la base de datos, un servicio de validación para asegurar la
  validez de los datos, y un sistema de registro de eventos para la auditoría.
  @module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarCircuito from "@/services/circuitos/validarEditarCircuito"; // Servicio para validar los datos de edición del circuito.

/**
  Maneja las solicitudes HTTP PATCH para editar un circuito existente.
  @async@function PATCH
  @param {Request} request - Objeto de la solicitud que contiene los detalles del circuito a editar.
  @returns {Promise>} - Una respuesta HTTP en formato JSON con los resultados de la operación o un error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, id_parroquia, id_circuito } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarCircuito(
      nombre,
      id_parroquia,
      id_circuito
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "circuito",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar circuito",
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

    // 4. Actualizar circuito en la base de datos y obtiene los datos actualizados
    const [actualizado, circuitoActualizado] = await prisma.$transaction([
      prisma.circuito.update({
        where: { id: validaciones.id_circuito },
        data: {
          nombre: validaciones.nombre,
          id_parroquia: validaciones.id_parroquia,
        },
      }),

      prisma.circuito.findFirst({
        where: {
          id: validaciones.id_circuito,
          borrado: false,
        },
      }),
    ]);

    // 5. Condición de error si no se actualiza el circuito
    if (!circuitoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "circuito",
        accion: "ERROR_UPDATE_CIRCUITO",
        id_objeto: validaciones.id_circuito,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el circuito",
        datosAntes: { nombre, id_parroquia, id_circuito },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar circuito actualizado",
        {},
        400
      );
    }

    // 6. Condición de éxito: el circuito fue actualizado correctamente
    await registrarEventoSeguro(request, {
      tabla: "circuito",
      accion: "UPDATE_CIRCUITO",
      id_objeto: circuitoActualizado[0]?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Circuito actualizado con exito id: ${validaciones.id_circuito}`,
      datosAntes: {
        nombre: nombre,
        id_circuito: id_circuito,
        id_parroquia: id_parroquia,
      },
      datosDespues: circuitoActualizado,
    });

    return generarRespuesta(
      "ok",
      "Circuito actualizado...",
      { circuitos: circuitoActualizado },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (actualizar circuito): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "circuito",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizarl circuito",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar circuito)",
      {},
      500
    );
  }
}
