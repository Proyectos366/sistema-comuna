/**
 @fileoverview Controlador de API para la creación de una nueva parroquia. Este endpoint recibe
 datos desde el cliente, valida la información, crea el registro en la base de datos y registra
 eventos de auditoría. Utiliza Prisma como ORM y servicios personalizados para validación y
 trazabilidad. @module api/parroquias/crear
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarCrearParroquia from "@/services/parroquias/validarCrearParroquia"; // Servicio para validar datos de creación
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP POST para crear una nueva parroquia.
 * Valida los datos recibidos, crea el registro en la base de datos,
 * registra eventos de auditoría y retorna una respuesta estandarizada.
 *
 * @async
 * @function POST
 * @param {Request} request - Objeto de solicitud HTTP con los datos en formato JSON.
 * @returns {Promise<Response>} Respuesta HTTP con el resultado de la operación.
 */

export async function POST(request) {
  try {
    // 1. Extrae los datos enviados en el cuerpo de la solicitud
    const { nombre, descripcion, id_pais, id_estado, id_municipio } =
      await request.json();

    // 2. Valida los datos antes de proceder con la creación
    const validaciones = await validarCrearParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio
    );

    // 3. Si la validación falla, registra el intento fallido y retorna error
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "INTENTO_FALLIDO_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear parroquia",
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

    // 4. Crea el nuevo registro de parroquia en la base de datos
    const nuevaParroquia = await prisma.parroquia.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        serial: validaciones.serial,
        id_municipio: validaciones.id_municipio,
        id_usuario: validaciones.id_usuario,
      },
    });

    // 5. Consulta todos los países, estados, municipios y parroquias
    const todosPaises = await prisma.pais.findMany({
      where: {
        borrado: false,
      },
      include: {
        estados: {
          include: {
            municipios: {
              include: {
                parroquias: true,
              },
            },
          },
        },
      },
    });

    // 6. Condición de error si no se crea la parroquia
    if (!nuevaParroquia) {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "ERROR_CREAR_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear la parroquia",
        datosAntes: null,
        datosDespues: nuevaParroquia,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo la parroquia",
        {},
        400
      );
    }

    // 7. Condición de éxito: la parroquia fue creada correctamente
    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "CREAR_PARROQUIA",
      id_objeto: nuevaParroquia.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Parroquia creada con exito",
      datosAntes: null,
      datosDespues: nuevaParroquia,
    });

    return generarRespuesta(
      "ok",
      "Parroquia creada...",
      {
        parroquias: nuevaParroquia,
        paises: todosPaises,
      },
      201
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (parroquias): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear parroquia",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (parroquias)", {}, 500);
  }
}
