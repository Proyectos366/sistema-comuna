/**
 @fileoverview Controlador de API para consultar voceros asociados a una parroquia específica. Este
 endpoint valida el ID de la parroquia recibido en la solicitud, realiza la consulta en la base de datos
 y retorna la lista de voceros correspondientes. También registra eventos de auditoría para intentos
 fallidos, errores y consultas exitosas. Utiliza Prisma como ORM y servicios personalizados para
 validación. @module api/voceros/validarConsultarVocerosIdParroquia
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarConsultarVocerosIdParroquia from "@/services/voceros/validarConsultarVocerosIdParroquia"; // Servicio para validar el ID de comuna
import registrarEventoSeguro from "@/libs/trigget";

/**
 Maneja las solicitudes HTTP GET para consultar voceros por ID de parroquia.
 Valida la solicitud, consulta la base de datos y retorna una respuesta estructurada.
 @async
 @function GET
 @param {Request} request - Solicitud HTTP con el ID de la parroquia.
 @returns {Promise<Response>} Respuesta HTTP con la lista de voceros o un mensaje de error.
*/

export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarVocerosIdParroquia(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al intentar consultar vocero por id_parroquia",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(validaciones.status, validaciones.message);
    }

    // 3. Consulta el vocero por id_parroquia
    const voceroPorParroquia = await prisma.vocero.findMany({
      where: {
        id_parroquia: validaciones.id_parroquia,
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
          select: { id: true, nombre: true },
        },
        consejos: { select: { nombre: true, id: true } },
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
    if (!voceroPorParroquia) {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "ERROR_CONSULTAR_VOCERO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo consultar el vocero por el id_parroquia",
        datosAntes: validaciones,
        datosDespues: voceroPorParroquia,
      });

      return generarRespuesta(
        "error",
        "No hay voceros en esta comuna...",
        { voceros: [] },
        404
      );
    }

    // 5. Registra el evento exitoso de consulta
    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "CONSULTAR_VOCERO",
      id_objeto: voceroPorParroquia.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Vocero consultado por id_parroquia con exito`,
      datosAntes: validaciones,
      datosDespues: voceroPorParroquia,
    });

    // 6. Retorna la respuesta exitosa con los voceros encontrados
    return generarRespuesta(
      "ok",
      "Voceros encontrados.",
      { voceros: voceroPorParroquia },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error, interno al consultar voceros id parroquia: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion:
        "Error inesperado al consultar el vocero por el id_parroquia",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno al consultar voceros id parroquia...",
      {},
      500
    );
  }
}
