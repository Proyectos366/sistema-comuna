/**
 @fileoverview Controlador de API para eliminar (o marcar como eliminado) un cargo del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de eliminación en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del cargo. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/cargos/eliminarCargo
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEliminarCargo from "@/services/cargos/validarEliminarCargo"; // Servicio para validar la eliminación del cargo
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para eliminar (lógicamente) un cargo.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del cargo.
 
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de eliminación y el ID del cargo.
 @returns {Promise<Response>} Respuesta HTTP con el cargo actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_cargo } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarEliminarCargo(estado, id_cargo);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar el cargo",
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

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta el cargo actualizado
    const [eliminandoCargo, cargoActualizado] = await prisma.$transaction([
      prisma.cargo.update({
        where: { id: validaciones.id_cargo },
        data: {
          borrado: validaciones.borrado,
        },
      }),

      prisma.cargo.findFirst({
        where: {
          id: validaciones.id_cargo,
        },
      }),
    ]);

    // 5. Si no se obtiene el cargo o la actualización falla, registra el error y retorna
    if (!eliminandoCargo || !cargoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "ERROR_DELETE_CARGO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar el cargo",
        datosAntes: null,
        datosDespues: {
          eliminandoCargo,
          cargoActualizado,
        },
      });

      return generarRespuesta("error", "Error, al eliminar cargo...", {}, 400);
    }

    // 6. Registro exitoso del evento y retorno del cargo actualizado
    await registrarEventoSeguro(request, {
      tabla: "cargo",
      accion: "DELETE_CARGO",
      id_objeto: cargoActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Cargo eliminado con exito...",
      datosAntes: null,
      datosDespues: {
        eliminandoCargo,
        cargoActualizado,
      },
    });

    // 7. Retorna una respuesta exitosa con el cargo actualizado
    return generarRespuesta(
      "ok",
      "Cargo eliminado correctamente...",
      {
        cargos: cargoActualizado,
      },
      200
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (eliminar cargo): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "cargo",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_cargo: 0,
      descripcion: "Error inesperado al eliminar cargo",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (eliminar cargo)",
      {},
      500
    );
  }
}
