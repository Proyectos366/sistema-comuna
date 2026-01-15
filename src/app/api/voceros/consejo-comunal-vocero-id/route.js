/**
 @fileoverview Controlador de API para consultar voceros asociados a un consejo comunal específico.
 Este endpoint valida el ID del consejo comunal recibido en la solicitud, realiza la consulta en la
 base de datos y retorna la lista de voceros correspondientes. También registra eventos de auditoría
 para intentos fallidos, errores y consultas exitosas. Utiliza Prisma como ORM y servicios
 personalizados para validación. @module api/voceros/consultarPorIdConsejoComunal
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarConsultarVoceroIdConsejoComunal from "@/services/voceros/validarConsultarVoceroIdConsejoComunal"; // Servicio para validar el ID del consejo comunal
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP GET para consultar voceros por ID de consejo comunal.
 * Valida la solicitud, consulta la base de datos y retorna una respuesta estructurada.
 *
 * @async
 * @function GET
 * @param {Request} request - Solicitud HTTP con el ID del consejo comunal.
 * @returns {Promise<Response>} Respuesta HTTP con la lista de voceros o un mensaje de error.
 */

export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarVoceroIdConsejoComunal(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al intentar consultar vocero por id_consejo",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Consulta los voceros por id_consejo
    const vocerosPorConsejoComunal = await prisma.vocero.findMany({
      where: {
        id_consejo: validaciones.id_consejo,
        borrado: false,
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
        consejos: { select: { nombre: true } },
        cursos: {
          where: { borrado: false },
          select: {
            verificado: true,
            certificado: true,
            formaciones: { select: { id: true, nombre: true } },
            asistencias: {
              select: {
                id: true,
                presente: true,
                formador: true,
                descripcion: true,
                fecha_registro: true,
                modulos: { select: { id: true, nombre: true } },
              },
            },
          },
        },
        cargos: {
          select: { nombre: true, id: true },
        },
      },
    });

    // 4. Si no se encuentran voceros, registra el evento y retorna respuesta vacía
    if (!vocerosPorConsejoComunal) {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "ERROR_CONSULTAR_VOCERO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo consultar el vocero por el id_consejo",
        datosAntes: validaciones,
        datosDespues: vocerosPorConsejoComunal,
      });

      return generarRespuesta(
        "ok",
        "No hay voceros en este consejo comunal.",
        { voceros: [] },
        200
      );
    }

    // 5. Registra el evento exitoso de consulta
    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "CONSULTAR_VOCERO",
      id_objeto: vocerosPorConsejoComunal.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Vocero consultado por id_consejo con exito`,
      datosAntes: validaciones,
      datosDespues: vocerosPorConsejoComunal,
    });

    // 6. Retorna la respuesta exitosa con los voceros encontrados
    return generarRespuesta(
      "ok",
      "Voceros encontrados.",
      { voceros: vocerosPorConsejoComunal },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno al consultar voceros id_consejo: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar el vocero por el id_consejo",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al consultar voceros id_consejo",
      {},
      500
    );
  }
}
