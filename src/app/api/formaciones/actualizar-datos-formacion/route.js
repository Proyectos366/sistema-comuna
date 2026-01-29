/**
  @fileoverview Controlador de API para la edición de una formación existente. Este archivo
  maneja la lógica para actualizar los detalles de una formación en la base de datos a través
  de una solicitud PATCH. Utiliza Prisma para la interacción con la base de datos, un servicio
  de validación para asegurar la validez de los datos, y un sistema de registro de eventos
  para la auditoría.@module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarFormacion from "@/services/formaciones/validarEditarFormacion"; // Servicio para validar los datos de edición de la formación.
/**
  Maneja las solicitudes HTTP PATCH para editar una formación existente.
  @async@function PATCH
  @param {Request} request - Objeto de la solicitud que contiene los detalles de la formación a editar.
  @returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, descripcion, cantidadModulos, id_formacion } =
      await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarFormacion(
      nombre,
      cantidadModulos,
      descripcion,
      id_formacion,
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario || 0,
        descripcion: "Validación fallida al intentar editar la formación",
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

    // 4. Consulta la formación actual para poder actualizarla
    const formacionDespues = await prisma.formacion.findUnique({
      where: { id: validaciones.id_formacion, borrado: false },
      include: { modulos: true },
    });

    // 5. Condición de error si no se encuentra la formación
    if (!formacionDespues) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_UPDATE_FORMACION",
        id_objeto: validaciones.id_formacion,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo consultar la formación actualizada",
        datosAntes: { nombre, descripcion, id_formacion },
        datosDespues: null,
      });

      return generarRespuesta(
        "error",
        "Error, no se actualizo la formación",
        {},
        400,
      );
    }

    // 7. Registra el evento de éxito
    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "UPDATE_FORMACION",
      id_objeto: formacionDespues.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Formación actualizada con éxito id: ${validaciones.id_formacion}`,
      datosAntes: { nombre, descripcion, id_formacion },
      datosDespues: formacionDespues,
    });

    return generarRespuesta(
      "ok",
      "Formación actualizada",
      { formaciones: formacionDespues },
      201,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.error("Error interno (actualizar formación):", error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la formación",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al actualizar la formación",
      {},
      500,
    );
  }
}
