/**
 @fileoverview Controlador de API para la creación de un país. Este archivo gestiona la lógica
 para registrar un nuevo país en la base de datos mediante una solicitud HTTP POST. Utiliza Prisma
 para interactuar con la base de datos, un sistema de validación para asegurar la integridad de
 los datos, y un sistema de eventos para registrar acciones relevantes del usuario. @module
*/

// 📦 Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de forma segura.
import validarCrearPais from "@/services/paises/validarCrearPais"; // Servicio para validar los datos antes de crear un país.

/**
 * Maneja las solicitudes HTTP POST para crear un nuevo país.
 * @async
 * @function POST
 * @param {Request} request - Objeto de solicitud HTTP que contiene los datos del país a registrar.
 * @returns {Promise<Response>} - Una respuesta HTTP en formato JSON con el resultado de la operación.
 */

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, capital, descripcion, serial } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearPais(
      nombre,
      capital,
      descripcion,
      serial
    );

    // 3. Si la validación falla, registra el evento y retorna error
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "INTENTO_FALLIDO_PAIS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear pais",
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

    // 4. Crea el nuevo país en la base de datos
    const [nuevoPais, paisCreado] = await prisma.$transaction([
      prisma.pais.create({
        data: {
          nombre: validaciones.nombre,
          capital: validaciones.capital,
          descripcion: validaciones.descripcion,
          serial: validaciones.serial,
          id_usuario: validaciones.id_usuario,
        },
      }),

      prisma.pais.findFirst({
        where: {
          nombre: validaciones.nombre,
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

    // 5. Si no se crea correctamente, registra el error
    if (!nuevoPais) {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "ERROR_CREAR_PAIS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el pais",
        datosAntes: null,
        datosDespues: nuevoPais,
      });

      return generarRespuesta("error", "Error, no se creo el pais", {}, 400);
    }

    // 6. Si se crea correctamente, registra el evento exitoso
    await registrarEventoSeguro(request, {
      tabla: "pais",
      accion: "CREAR_PAIS",
      id_objeto: nuevoPais.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Pais creado con exito",
      datosAntes: null,
      datosDespues: nuevoPais,
    });

    return generarRespuesta(
      "ok",
      "Pais creado...",
      { paises: paisCreado },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (pais): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "pais",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear pais",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (pais)", {}, 500);
  }
}
