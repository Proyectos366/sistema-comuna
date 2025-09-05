/**
 * @fileoverview Controlador de API para la actualización de un cargo.
 * Este archivo maneja la lógica para editar un registro en la base de datos a través de una solicitud POST.
 * Utiliza Prisma para la interacción con la base de datos y un sistema de registro de eventos para seguridad.
 * @module
 */

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad en la base de datos.
import validarEditarCargo from "@/services/cargos/validarEditarCargo"; // Servicio para validar los datos de entrada del cargo.

/**
 * Maneja las solicitudes HTTP POST para actualizar un cargo.
 * @async
 * @function POST
 * @param {object} request - El objeto de la solicitud HTTP.
 * @returns {Promise<object>} - Una respuesta HTTP en formato JSON.
 */

export async function POST(request) {
  try {
    // 1. Obtiene los datos del cuerpo de la solicitud (request)
    const { nombre, descripcion, id_cargo } = await request.json();

    // 2. Valida los datos recibidos utilizando el servicio 'validarEditarCargo'
    const validaciones = await validarEditarCargo(
      nombre,
      descripcion,
      id_cargo
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      // Registra un evento de intento fallido en la bitácora de seguridad
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar el cargo",
        datosAntes: null,
        datosDespues: validaciones,
      });

      // Retorna una respuesta de error con un código de estado 400 (Bad Request)
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 4. Inicia una transacción de Prisma para asegurar la integridad de los datos
    const [actualizado, cargoActualizado] = await prisma.$transaction([
      // 4.1. Actualiza el cargo en la base de datos
      prisma.cargo.update({
        where: { id: validaciones.id_cargo },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      // 4.2. Consulta el registro actualizado para confirmar la operación
      prisma.cargo.findMany({
        where: {
          id: validaciones.id_cargo,
          borrado: false,
        },
      }),
    ]);

    // 5. Condición de error al consultar el cargo actualizado
    if (!cargoActualizado) {
      // Registra un evento de error de actualización en la bitácora
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "ERROR_UPDATE_CARGO",
        id_objeto: validaciones.id_cargo,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el cargo",
        datosAntes: { nombre, descripcion, id_cargo },
        datosDespues: actualizado,
      });

      // Retorna una respuesta de error con un código de estado 400
      return generarRespuesta(
        "error",
        "Error, al consultar el cargo actualizado",
        {},
        400
      );
    } else {
      // 6. Condición de éxito: el cargo se actualizó correctamente
      // Registra un evento de actualización exitosa en la bitácora
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "UPDATE_CARGO",
        id_objeto: cargoActualizado[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Cargo actualizado con exito id: ${validaciones.id_cargo}`,
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          id_cargo: id_cargo,
        },
        datosDespues: cargoActualizado,
      });

      // Retorna una respuesta de éxito con un código de estado 201 (Created)
      return generarRespuesta(
        "ok",
        "Cargo actualizado...",
        { cargo: cargoActualizado },
        201
      );
    }
  } catch (error) {
    // 7. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno (actualizar cargo): ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "cargo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el cargo",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar cargo)",
      {},
      500
    );
  }
}
