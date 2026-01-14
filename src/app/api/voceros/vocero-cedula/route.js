/**
 @fileoverview Controlador de API para consultar un vocero por número de cédula. Este endpoint valida
 la cédula recibida, realiza la búsqueda en la base de datos y retorna los datos del vocero si existe.
 También registra eventos de auditoría para intentos fallidos, errores y consultas exitosas. Utiliza
 Prisma como ORM. @module api/voceros/consultarPorCedula
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría
import validarConsultarVoceroCedula from "@/services/voceros/ValidarConsultarUsuarioCedula";

/**
 * Maneja las solicitudes HTTP POST para consultar un vocero por cédula.
 * Valida la cédula, consulta la base de datos y retorna una respuesta estructurada.
 *
 * @async
 * @function POST
 * @param {Request} request - Solicitud HTTP con la cédula del vocero a consultar.
 * @returns {Promise<Response>} Respuesta HTTP con los datos del vocero o un mensaje de error.
 */

export async function POST(request) {
  try {
    // 1. Extrae los datos del cuerpo de la solicitud
    const { cedula } = await request.json();

    // 2. Valida los datos recibidos
    const validaciones = await validarConsultarVoceroCedula(cedula);

    // 3. Si la validación falla, registra el intento y retorna error
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion:
          "Validacion fallida al intentar consultar vocero por cedula",
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

    // 4. Consulta el vocero por cédula
    const voceroPorCedula = await prisma.vocero.findUnique({
      where: {
        cedula: validaciones.cedula,
      },
      select: {
        id: true,
        nombre: true,
        nombre_dos: true,
        apellido: true,
        apellido_dos: true,
        cedula: true,
        telefono: true,
        correo: true,
        edad: true,
        genero: true,
        laboral: true,
        createdAt: true,
        comunas: {
          select: { nombre: true, id: true, id_parroquia: true },
        },
        circuitos: {
          select: { nombre: true, id: true },
        },
        parroquias: {
          select: { nombre: true },
        },
        consejos: {
          select: { nombre: true },
        },
        cursos: {
          where: { borrado: false },
          select: {
            verificado: true,
            certificado: true,
            formaciones: {
              select: { nombre: true },
            },
            asistencias: {
              select: {
                id: true,
                presente: true,
                formador: true,
                descripcion: true,
                fecha_registro: true,
                modulos: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
              },
            },
          },
        },
        cargos: {
          select: { nombre: true, id: true },
        },
      },
    });

    // 5. Si no se encuentra el vocero, registra el error y retorna respuesta
    if (!voceroPorCedula) {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "ERROR_CONSULTAR_VOCERO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo consultar el vocero por cedula",
        datosAntes: validaciones,
        datosDespues: voceroPorCedula,
      });

      return generarRespuesta(
        "error",
        "Error, no existe el vocero...",
        {},
        400
      );
    }

    // 6. Registra el evento exitoso de consulta
    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "CONSULTAR_VOCERO",
      id_objeto: voceroPorCedula.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Vocero consultado por cedula con exito`,
      datosAntes: validaciones,
      datosDespues: voceroPorCedula,
    });

    // 7. Retorna la respuesta exitosa con los datos del vocero
    return generarRespuesta(
      "ok",
      "Vocero encontrado...",
      { voceros: [voceroPorCedula] },
      200
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno, al consultar vocero por cedula: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar el vocero por cedula",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al consultar vocero...",
      {},
      500
    );
  }
}
