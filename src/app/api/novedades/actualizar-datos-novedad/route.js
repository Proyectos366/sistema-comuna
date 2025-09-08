/**
@fileoverview Controlador de API para la edición de una novedad existente. Este archivo maneja
la lógica para actualizar los detalles de una novedad en la base de datos a través de una solicitud
POST. Utiliza Prisma para la interacción con la base de datos, un servicio de validación para
asegurar la validez de los datos, y un sistema de registro de eventos para la auditoría. @module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarNovedad from "@/services/novedades/validarEditarNovedad"; // Servicio para validar los datos de edición de la novedad.
/**
Maneja las solicitudes HTTP POST para editar una novedad existente.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles de la novedad a editar.@returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, descripcion, id_novedad } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarNovedad(
      nombre,
      descripcion,
      id_novedad
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "INTENTO_FALLIDO_NOVEDAD",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar la novedad",
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

    // 4. Actualiza la novedad en la base de datos
    const { novedades } = await prisma.$transaction(async (tx) => {
      // 1. Actualizar la novedad
      await tx.novedad.update({
        where: { id: validaciones.id_novedad },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      });

      // 2. Obtener la novedad con sus recepciones
      const novedadActualizada = await tx.novedad.findFirst({
        where: {
          id: validaciones.id_novedad,
          borrado: false,
        },
        include: {
          recepciones: {
            select: {
              id: true,
              id_novedad: true,
              recibido: true,
              fechaRecibido: true,
              id_departamento: true, // Asegúrate de que este campo existe
            },
          },
        },
      });

      // 3. Transformar la respuesta para el frontend
      const novedades = novedadActualizada.recepciones.map((r) => ({
        id: novedadActualizada.id,
        nombre: novedadActualizada.nombre,
        descripcion: novedadActualizada.descripcion,
        recibido: r.recibido,
        fechaRecibido: r.fechaRecibido,
        id_departamento: r.id_departamento,
      }));

      return { novedades };
    });

    // 5. Condición de error si no se actualiza la novedad
    if (!novedades) {
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "ERROR_UPDATE_NOVEDAD",
        id_objeto: validaciones.id_novedad,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la novedad",
        datosAntes: { nombre, descripcion, id_novedad },
        datosDespues: novedades,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar la novedad actualizada",
        {},
        400
      );
    } else {
      // 6. Condición de éxito: la novedad fue actualizada correctamente
      await registrarEventoSeguro(request, {
        tabla: "novedad",
        accion: "UPDATE_NOVEDAD",
        id_objeto: novedades.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Novedad actualizada con exito id: ${validaciones.id_novedad}`,
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          id_novedad: id_novedad,
        },
        datosDespues: novedades,
      });

      return generarRespuesta(
        "ok",
        "Novedad actualizada...",
        { novedades: novedades },
        201
      );
    }
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (actualizar novedad): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "novedad",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la novedad",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar novedad)",
      {},
      500
    );
  }
}
