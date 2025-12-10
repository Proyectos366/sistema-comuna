/**
 @fileoverview Controlador de API para eliminar (o marcar como eliminado) un consejo comunal del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de eliminación en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del consejo comunal.
 Utiliza Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/consejos/eliminarConsejoComunal
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarEliminarConsejoComunal from "@/services/consejos/validarEliminarConsejoComunal"; // Servicio para validar la eliminación de consejo comunal
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para eliminar (lógicamente) un consejo comunal.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del consejo comunal.
 
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de eliminación y el ID del consejo comunal.
 @returns {Promise<Response>} Respuesta HTTP con el consejo comunal actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_consejo } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarEliminarConsejoComunal(
      estado,
      id_consejo
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar el consejo comunal",
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

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta el consejo comunal actualizado
    const [eliminandoConsejo, consejoActualizado] = await prisma.$transaction([
      prisma.consejo.update({
        where: { id: validaciones.id_consejo },
        data: {
          borrado: validaciones.borrado,
        },
      }),

      prisma.consejo.findFirst({
        where: {
          id: validaciones.id_consejo,
        },
      }),
    ]);

    // 5. Si no se obtiene el consejo comunal o la actualización falla, registra el error y retorna
    if (!eliminandoConsejo || !consejoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_DELETE_CONSEJO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar el consejo comunal",
        datosAntes: null,
        datosDespues: {
          eliminandoConsejo,
          consejoActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al eliminar consejo comunal...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno del consejo comunal actualizado
    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "DELETE_CONSEJO",
      id_objeto: consejoActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Consejo comunal eliminado con exito",
      datosAntes: null,
      datosDespues: {
        eliminandoConsejo,
        consejoActualizado,
      },
    });

    return generarRespuesta(
      "ok",
      "Consejo comunal eliminado correctamente...",
      {
        consejos: consejoActualizado,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (eliminar consejo): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_consejo: 0,
      descripcion: "Error inesperado al eliminar consejo",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (eliminar consejo)",
      {},
      500
    );
  }
}
