/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurado) a un pais del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del pais. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/paises/restaurarPais
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarPais from "@/services/paises/validarRestaurarPais"; // Servicio para validar la restauración del pais
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) a un pais.
 * Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 * y retorna una respuesta estructurada con el perfil actualizado del pais.
 *
 * @async
 * @function PATCH
 * @param {Request} request - Solicitud HTTP con el estado de restauración y el ID del pais.
 * @returns {Promise<Response>} Respuesta HTTP con el pais actualizado o un mensaje de error.
 */

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_pais } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarPais(estado, id_pais);

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar pais",
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

    // 4. Ejecuta transacción: actualiza el estado de eliminación y consulta el pais actualizado
    const [restaurandoPais, paisActualizado] = await prisma.$transaction([
      prisma.pais.update({
        where: { id: validaciones.id_pais },
        data: {
          borrado: validaciones.borrado,
        },
      }),

      prisma.pais.findFirst({
        where: {
          id: validaciones.id_pais,
        },
        include: {
          estados: {
            include: {
              municipios: {
                include: {
                  parroquias: true,
                  instituciones: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // 5. Si no se obtiene el pais o la actualización falla, registra el error y retorna
    if (!restaurandoPais || !paisActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "ERROR_DELETE_PAIS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar el pais",
        datosAntes: null,
        datosDespues: {
          restaurandoPais,
          paisActualizado,
        },
      });

      return generarRespuesta("error", "Error, al eliminar pais...", {}, 400);
    }

    // 6. Registro exitoso del evento y retorno del pais actualizado
    await registrarEventoSeguro(request, {
      tabla: "pais",
      accion: "RESTAURAR_PAIS",
      id_objeto: paisActualizado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Pais restaurado con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoPais,
        paisActualizado,
      },
    });

    return generarRespuesta(
      "ok",
      "Pais restaurado correctamente...",
      {
        paises: paisActualizado,
      },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (restaurar pais): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "pais",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_pais: 0,
      descripcion: "Error inesperado al restaurar pais",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar pais)",
      {},
      500
    );
  }
}
