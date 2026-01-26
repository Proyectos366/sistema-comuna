/**
  @fileoverview Controlador de API para la consulta de todos los cursos por formacion.
  Este archivo maneja la lógica para obtener todos los cursos por idFormacion de la base
  de datosa través de una solicitud GET. Utiliza Prisma para la interacción con la base de
  datos y un sistema de autenticación para validar el acceso.
  @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarCursosIdFormacion from "@/services/cursos/validarConsultarCursosIdFormacion";

/**
  Maneja las solicitudes HTTP GET para obtener todos los cursos por formacion.
  @async@function GET
  @returns {Promise>} - Una respuesta HTTP en formato JSON con los cursos encontrados o un error.
*/

export async function GET(request) {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarCursosIdFormacion(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 3. Consulta todos los cursos en la base de datos
    const cursosPorFormacion = await prisma.curso.findMany({
      where: { borrado: false, id_formacion: validaciones.id_formacion },
      include: {
        voceros: {
          select: {
            id: true,
            cedula: true,
            edad: true,
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            genero: true,
            telefono: true,
            correo: true,
            f_n: true,
            laboral: true,
            createdAt: true,
            comunas: {
              select: {
                id: true,
                nombre: true, // Trae el nombre de la comuna
              },
            },
            consejos: {
              select: {
                id: true,
                nombre: true,
              },
            },
            circuitos: {
              select: {
                id: true,
                nombre: true,
              },
            },
            parroquias: {
              select: {
                id: true,
                nombre: true,
              },
            },
            cargos: {
              select: { id: true, nombre: true },
            },
          },
        },
        formaciones: {
          include: {
            modulos: {
              include: {
                asistencias: true, // Relaciona módulos con asistencias
              },
            },
          },
        },
        asistencias: true,
      },
    });

    // 4. Condición de error si no se obtienen cursos
    if (!cursosPorFormacion) {
      return generarRespuesta("error", "Error, al consultar cursos", {}, 400);
    }

    // 5. Condición de éxito: se encontraron cursos
    return generarRespuesta(
      "ok",
      "Todos los cursos por formación",
      {
        cursos: cursosPorFormacion,
      },
      200,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (cursos por formacion): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (cursos por formacion)",
      {},
      500,
    );
  }
}
