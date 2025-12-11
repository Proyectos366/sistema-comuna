/**
  @fileoverview Controlador de API para la edición de un consejo comunal existente. Este archivo
  maneja la lógica para actualizar los detalles de un consejo comunal en la base de datosa través
  de una solicitud PATCH. Utiliza Prisma para la interacción con la base de datos, un servicio de
  validaciónpara asegurar la validez de los datos, y un sistema de registro de eventos para la
  auditoría. @module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarConsejoComunal from "@/services/consejos-comunales/validarEditarConsejoComunal"; // Servicio para validar los datos de edición del consejo comunal.
/**
  Maneja las solicitudes HTTP PATCH para editar un consejo comunal existente.
  @async@function PATCH
  @param {Request} request - Objeto de la solicitud que contiene los detalles
  del consejo comunal a editar.
  @returns Promise - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, descripcion, id_comuna, id_circuito, id_consejo } =
      await request.json();

    // Inicializa propiedades adicionales que no se utilizan.
    const { direccion, norte, sur, este, oeste, punto, rif, codigo } = "";

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarConsejoComunal(
      nombre,
      descripcion,
      id_comuna,
      id_circuito,
      id_consejo
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar consejo comunal",
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

    // 4. Actualiza el consejo comunal en la base de datos y obtiene los datos actualizados
    const [actualizado, consejoComunalActualizado] = await prisma.$transaction([
      prisma.consejo.update({
        where: { id: validaciones.id_consejo },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          id_comuna: validaciones.id_comuna,
          id_circuito: validaciones.id_circuito,
        },
      }),

      prisma.consejo.findFirst({
        where: {
          id: validaciones.id_consejo,
          borrado: false,
        },
      }),
    ]);

    // 5. Condición de error si no se actualiza el consejo comunal
    if (!consejoComunalActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_UPDATE_CONSEJO_COMUNAL",
        id_objeto: validaciones.id_consejo,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el consejo comunal",
        datosAntes: { nombre, id_comuna, id_consejo },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar consejo actualizado",
        {},
        400
      );
    }

    // 6. Condición de éxito: el consejo comunal fue actualizado correctamente
    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "UPDATE_CONSEJO_COMUNAL",
      id_objeto: consejoComunalActualizado[0]?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Consejo comunal actualizado con exito id: ${validaciones.id_consejo}`,
      datosAntes: {
        nombre: nombre,
        id_comuna: id_comuna,
        id_consejo: id_consejo,
      },
      datosDespues: consejoComunalActualizado,
    });

    return generarRespuesta(
      "ok",
      "Consejo comunal actualizado...",
      { consejos: consejoComunalActualizado },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (actualizar consejo): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el consejo comunal",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar consejo)",
      {},
      500
    );
  }
}
