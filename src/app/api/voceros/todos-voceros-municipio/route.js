/**
 @fileoverview Controlador de API para consultar voceros asociados a un municipio específico. Este
 endpoint valida el contexto de la solicitud, obtiene las parroquias vinculadas al municipio y
 consulta todos los voceros pertenecientes a dichas parroquias. También registra eventos de auditoría
 para intentos fallidos, errores y consultas exitosas. Utiliza Prisma como ORM y servicios
 personalizados. @module api/voceros/consultarPorMunicipi
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas HTTP estandarizadas
import validarConsultarVocerosMunicipio from "@/services/voceros/validarConsultarVocerosMunicipio"; // Servicio para validar el municipio y obtener sus parroquias
import registrarEventoSeguro from "@/libs/trigget"; // Servicio para registrar eventos de auditoría

/**
 * Maneja las solicitudes HTTP GET para consultar voceros por municipio.
 * Valida la solicitud, consulta la base de datos y retorna una respuesta estructurada.
 *
 * @async
 * @function GET
 * @returns {Promise<Response>} Respuesta HTTP con la lista de voceros o un mensaje de error.
 */

export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarVocerosMunicipio();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al intentar consultar vocero por id_municipio",
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

    // 3. Consulta todos los voceros asociados a las parroquias del municipio
    const todosVocerosMunicipio = await prisma.vocero.findMany({
      where: {
        id_parroquia: {
          in: validaciones.id_parroquias,
        },
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
          select: { nombre: true, id: true },
        },
        cursos: {
          where: { borrado: false },
          select: {
            verificado: true,
            certificado: true,
            formaciones: {
              select: { id: true, nombre: true },
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

    // 4. Si no se encuentran voceros, registra el evento y retorna respuesta vacía
    if (!todosVocerosMunicipio) {
      await registrarEventoSeguro(request, {
        tabla: "vocero",
        accion: "ERROR_CONSULTAR_VOCERO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo consultar el vocero por municipio",
        datosAntes: validaciones,
        datosDespues: todosVocerosMunicipio,
      });

      return generarRespuesta("error", "Error, no hay voceros...", {}, 400);
    }

    // 5. Registra el evento exitoso de consulta
    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "CONSULTAR_VOCERO",
      id_objeto: 0,
      id_usuario: validaciones.id_usuario,
      descripcion: `Voceros todos por municipio con exito`,
      datosAntes: validaciones,
      datosDespues: todosVocerosMunicipio,
    });

    // 6. Retorna la respuesta exitosa con los voceros encontrados
    return generarRespuesta(
      "ok",
      "Voceros encontrados...",
      { voceros: todosVocerosMunicipio },
      200
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno, al consultar voceros municipio: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "vocero",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar los voceros de un municipio",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al consultar voceros municipio...",
      {},
      500
    );
  }
}
