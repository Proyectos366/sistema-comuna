/**
 @fileoverview Controlador de API para restaurar (o marcar como restaurado) un departamento del
 sistema. Este endpoint valida los datos recibidos, actualiza el estado de restauración en la base
 de datos, registra eventos de auditoría y retorna el perfil actualizado del departamento. Utiliza
 Prisma como ORM y servicios personalizados para validación y respuesta estandarizada.
 @module api/departamentos/restaurarDepartamanto
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarRestaurarDepartamento from "@/services/departamentos/validarRestaurarDepartamento"; // Servicio para validar la restauración del departamento
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 Maneja las solicitudes HTTP PATCH para restaurar (lógicamente) un departamento.
 Valida los datos recibidos, actualiza el campo `borrado` en la base de datos
 y retorna una respuesta estructurada con el perfil actualizado del departamento.
 @async
 @function PATCH
 @param {Request} request - Solicitud HTTP con el estado de restauración y el ID del departamento.
 @returns {Promise<Response>} Respuesta HTTP con el departamento actualizado o un mensaje de error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { estado, id_departamento } = await request.json();

    // 2. Ejecuta la validación de los datos recibidos
    const validaciones = await validarRestaurarDepartamento(
      estado,
      id_departamento
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error 400
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "INTENTO_FALLIDO_RESTAURAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al restaurar departamento",
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

    // 4. Ejecuta transacción: actualiza el estado de restauracion y consulta el departamento actualizado
    const [restaurandoDepartamento, departamentoActualizada] =
      await prisma.$transaction([
        prisma.departamento.update({
          where: { id: validaciones.id_departamento },
          data: {
            borrado: validaciones.borrado,
          },
        }),

        prisma.departamento.findFirst({
          where: {
            id: validaciones.id_departamento,
          },
        }),
      ]);

    // 5. Si no se obtiene el departamento o la actualización falla, registra el error y retorna
    if (!restaurandoDepartamento || !departamentoActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "ERROR_DELETE_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo restaurar el departamento",
        datosAntes: null,
        datosDespues: {
          restaurandoDepartamento,
          departamentoActualizada,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al restaurar departamento...",
        {},
        400
      );
    }

    // 6. Registro exitoso del evento y retorno del departamento actualizado
    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "RESTAURAR_DEPARTAMENTO",
      id_objeto: departamentoActualizada.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Departamento restaurado con exito",
      datosAntes: null,
      datosDespues: {
        restaurandoDepartamento,
        departamentoActualizada,
      },
    });

    // 7. Retorna una respuesta exitosa con el departamento actualizado
    return generarRespuesta(
      "ok",
      "Departamento restaurado correctamente...",
      {
        departamentos: departamentoActualizada,
      },
      200
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (restaurar departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "ERROR_INTERNO_RESTAURAR",
      id_objeto: 0,
      id_departamento: 0,
      descripcion: "Error inesperado al restaurar departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (restaurar departamento)",
      {},
      500
    );
  }
}
