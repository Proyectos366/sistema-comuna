/**
 @fileoverview Controlador de API para la edición de un país. Este archivo gestiona la lógica
 para actualizar los datos de un país en la base de datos mediante una solicitud HTTP POST.
 Utiliza Prisma para interactuar con la base de datos, un sistema de validación para asegurar
 la integridad de los datos, y un sistema de eventos para registrar acciones relevantes del
 usuario. @module
*/

// 📦 Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de forma segura.
import validarEditarPais from "@/services/paises/validarEditarPais"; // Servicio para validar los datos antes de editar un país.

/**
 * Maneja las solicitudes HTTP POST para editar un país.
 * @async
 * @function POST
 * @param {Request} request - Objeto de solicitud HTTP que contiene los datos del país a editar.
 * @returns {Promise<Response>} - Una respuesta HTTP en formato JSON con el resultado de la operación.
 */

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, capital, descripcion, id_pais } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarPais(
      nombre,
      capital,
      descripcion,
      id_pais
    );

    // 3. Si la validación falla, registra el evento y retorna error
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "INTENTO_FALLIDO_PAIS",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar el pais",
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

    // 4. Ejecuta la transacción para actualizar y consultar el país
    const [actualizado, paisActualizado] = await prisma.$transaction([
      prisma.pais.update({
        where: { id: validaciones.id_pais },
        data: {
          nombre: validaciones.nombre,
          capital: validaciones.capital,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.pais.findFirst({
        where: {
          id: validaciones.id_pais,
          borrado: false,
        },
      }),
    ]);

    // 5. Si no se encuentra el país actualizado, registra el error
    if (!paisActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "ERROR_UPDATE_PAIS",
        id_objeto: validaciones.id_pais,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el pais",
        datosAntes: { nombre, capital, descripcion, id_pais },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar el pais actualizado",
        {},
        400
      );
    } else {
      // 6. Si se actualiza correctamente, registra el evento exitoso
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "UPDATE_PAIS",
        id_objeto: paisActualizado[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Pais actualizado con exito id: ${validaciones.id_pais}`,
        datosAntes: {
          nombre: validaciones.nombre,
          capital: validaciones.capital,
          descripcion: validaciones.descripcion,
          id_pais: validaciones.id_pais,
        },
        datosDespues: paisActualizado,
      });

      return generarRespuesta(
        "ok",
        "Pais actualizado...",
        { paises: paisActualizado },
        201
      );
    }
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (actualizar pais): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "pais",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el pais",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar pais)",
      {},
      500
    );
  }
}
