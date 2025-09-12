/**
 @fileoverview Controlador de API para consultar voceros asociados a un circuito comunal específico.
 Este endpoint valida el ID del circuito recibido en la solicitud, realiza la consulta en la base de
 datos y retorna la lista de voceros correspondientes. También registra eventos de auditoría para
 intentos fallidos, errores y consultas exitosas. Utiliza Prisma como ORM y servicios personalizados
 para la validación. @module api/voceros/consultarPorIdComuna
*/

import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarConsultarVoceroIdCircuito from "@/services/voceros/validarConsultarVoceroIdCircuito";

/**
 * Maneja las solicitudes HTTP GET para consultar voceros por ID de circuito.
 * Valida la solicitud, consulta la base de datos y retorna una respuesta estructurada.
 *
 * @async
 * @function GET
 * @param {Request} request - Solicitud HTTP con el ID de la circuito.
 * @returns {Promise<Response>} Respuesta HTTP con la lista de voceros o un mensaje de error.
 */

export async function GET(req) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarVoceroIdCircuito(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al intentar consultar vocero por id_circuito",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Consulta el vocero por id_circuito
    const vocerosPorCircuito = await prisma.vocero.findMany({
      where: {
        id_circuito: validaciones.id_circuito,
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
            formaciones: { select: { nombre: true } },
            asistencias: {
              select: {
                id: true,
                presente: true,
                formador: true,
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
    if (!vocerosPorCircuito) {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "ERROR_CONSULTAR_VOCERO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo consultar el vocero por el id_circuito",
        datosAntes: validaciones,
        datosDespues: vocerosPorCircuito,
      });

      return generarRespuesta(
        "ok",
        "No hay voceros en este circuito comunal.",
        { voceros: [] },
        200
      );
    }

    // 5. Registra el evento exitoso de consulta
    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "CONSULTAR_VOCERO",
      id_objeto: vocerosPorCircuito.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Vocero consultado por id_circuito con exito`,
      datosAntes: validaciones,
      datosDespues: vocerosPorCircuito,
    });

    // 6. Retorna la respuesta exitosa con los voceros encontrados
    return generarRespuesta(
      "ok",
      "Voceros encontrados.",
      { voceros: vocerosPorCircuitoComunal },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error, interno al consultar voceros circuito: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar el vocero por el id_circuito",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno al consultar voceros circuito...",
      {},
      500
    );
  }
}
