/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurada) una formacion del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado de la formacion. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/formaciones/restaurarFormacion
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarFormacion from "@/services/formaciones/validarRestaurarFormacion"; // Servicio para validar la restauración de la formacion
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) una formacion.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado de la formacion.
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de restauración y el ID de la formacion.
 @returns {Promise<Response>} Respuesta HTTP con la formacion actualizada o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_formacion } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarFormacion(estado, id_formacion);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al restaurar formacion",
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

    // 4. Ejecuta transacción: actualiza el estado de restauracion y consulta la formacion actualizada
    const [restaurandoFormacion, formacionActualizada] =
      await prisma.$transaction([
        prisma.formacion.update({
          where: { id: validaciones.id_formacion },
          data: {
            borrado: validaciones.borrado,
          },
        }),

        prisma.formacion.findFirst({
          where: {
            id: validaciones.id_formacion,
          },
          include: { modulos: true },
        }),
      ]);

    // 5. Si no se obtiene la formacion o la actualización falla, registra el error y retorna
    if (!restaurandoFormacion || !formacionActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_DELETE_FORMACION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo restaurar la formacion",
        datosAntes: null,
        datosDespues: {
          restaurandoFormacion,
          formacionActualizada,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al restaurar formacion...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno de la formacion actualizado
    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "RESTAURAR_FORMACION",
      id_objeto: formacionActualizada.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Formacion restaurada con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoFormacion,
        formacionActualizada,
      },
    });

    // 7. Retorna una respuesta exitosa con el formacion actualizado
    return generarRespuesta(
      "ok",
      "Formacion restaurada correctamente...",
      {
        formaciones: formacionActualizada,
      },
      200
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (restaurar formacion): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_formacion: 0,
      descripcion: "Error inesperado al restaurar formacion",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar formacion)",
      {},
      500
    );
  }
}
