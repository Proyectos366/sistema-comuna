/**
@fileoverview Controlador de API para la edición de una comuna existente.
Este archivo maneja la lógica para actualizar los detalles de una comuna en la base de datos
a través de una solicitud POST. Utiliza Prisma para la interacción con la base de datos,
un servicio de validaciónpara asegurar la validez de los datos, y un sistema de registro de 
eventos para la auditoría.
@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarComuna from "@/services/comunas/validarEditarComuna"; // Servicio para validar los datos de edición de la comuna.
/**
Maneja las solicitudes HTTP POST para editar una comuna existente.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles de la comuna a editar.@returns {Promise>} - Una respuesta HTTP en formato JSON con los resultados de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, id_parroquia, id_comuna } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarComuna(
      nombre,
      id_parroquia,
      id_comuna
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar comuna",
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

    // 4. Actualiza la comuna en la base de datos y obtiene los datos actualizados
    const [actualizada, comunaActualizada] = await prisma.$transaction([
      prisma.comuna.update({
        where: { id: validaciones.id_comuna },
        data: {
          nombre: validaciones.nombre,
          id_parroquia: validaciones.id_parroquia,
        },
      }),

      prisma.comuna.findMany({
        where: {
          id: validaciones.id_comuna,
          borrado: false,
        },
      }),
    ]);

    // 5. Condición de error si no se actualiza la comuna
    if (!comunaActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "ERROR_UPDATE_COMUNA",
        id_objeto: validaciones.id_comuna,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la comuna",
        datosAntes: { nombre, id_parroquia, id_comuna },
        datosDespues: actualizada,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar comuna actualizada",
        {},
        400
      );
    } else {
      // 6. Condición de éxito: la comuna fue actualizada correctamente
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "UPDATE_COMUNA",
        id_objeto: comunaActualizada[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Comuna actualizada con exito id: ${validaciones.id_comuna}`,
        datosAntes: {
          nombre: nombre,
          id_comuna: id_comuna,
          id_parroquia: id_parroquia,
        },
        datosDespues: comunaActualizada,
      });

      return generarRespuesta(
        "ok",
        "Comuna actualizada...",
        { comunas: comunaActualizada },
        201
      );
    }
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (actualizar comuna): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "comuna",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la comuna",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar comuna)",
      {},
      500
    );
  }
}
