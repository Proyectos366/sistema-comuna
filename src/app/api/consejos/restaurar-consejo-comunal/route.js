/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurado) un consejo comunal del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del consejo comunal. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/consejos/restaurarConsejoComunal
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarConsejoComunal from "@/services/consejos-comunales/validarRestaurarConsejoComunal"; // Servicio para validar la restauración del consejo comunal
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) un consejo comunal.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del consejo comunal.
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de restauración y el ID del consejo comunal.
 @returns {Promise<Response>} Respuesta HTTP con el consejo comunal actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_consejo } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarConsejoComunal(
      estado,
      id_consejo
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al restaurar consejo comunal",
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

    // 4. Ejecuta transacción: actualiza el estado de restauracion y consulta el consejo comunal actualizado
    const [restaurandoConsejo, consejoActualizado] = await prisma.$transaction([
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
    if (!restaurandoConsejo || !consejoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_DELETE_CONSEJO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo restaurar el consejo comunal",
        datosAntes: null,
        datosDespues: {
          restaurandoConsejo,
          consejoActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al restaurar consejo comunal...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno del consejo comunal actualizada
    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "RESTAURAR_CONSEJO",
      id_objeto: consejoActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Consejo comunal restaurado con exito...",
      datosAntes: null,
      datosDespues: {
        restaurandoConsejo,
        consejoActualizado,
      },
    });

    return generarRespuesta(
      "ok",
      "Consejo comunal restaurado correctamente...",
      {
        consejos: consejoActualizado,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (restaurar consejo): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_consejo: 0,
      descripcion: "Error inesperado al restaurar consejo comunal",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar consejo)",
      {},
      500
    );
  }
}
