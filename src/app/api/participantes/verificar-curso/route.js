/**
@fileoverview Controlador de API para verificar un curso asociado a un vocero. Este archivo
maneja la lógica para actualizar el estado de un curso a verificado a través de una solicitud PATCH.
Utiliza Prisma para la interacción con la base de datos, un servicio de validación para asegurar
la validez de los datos, y un sistema de registro de eventos para la auditoría.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarVerificarCurso from "@/services/cursos/validarVerificarCurso"; // Servicio para validar la solicitud de verificación del curso.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
/**
Maneja las solicitudes HTTP PATCH para verificar un curso.@async@function PATCH@param {Request} request - Objeto de la solicitud que contiene el ID del curso y del vocero a verificar.@returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { id_curso, id_vocero } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarVerificarCurso(id_curso, id_vocero);

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "INTENTO_FALLIDO_VERIFICAR_CURSO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: `Validacion fallida al verificar el curso del vocero id: ${validaciones.id_vocero}`,
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

    // 4. Actualiza el curso para marcarlo como verificado
    const verificarCurso = await prisma.curso.update({
      where: {
        id: validaciones.id_curso,
        id_vocero: validaciones.id_vocero,
      },
      data: {
        verificado: true,
        updatedAt: new Date(),
      },
    });

    // 5. Consulta el curso verificado junto con información relevante
    const nuevaAsistencia = await prisma.curso.findFirst({
      where: { id: verificarCurso.id, borrado: false }, // Filtra solo el curso afectado
      include: {
        voceros: {
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
            comunas: { select: { nombre: true } },
          },
        },
        formaciones: {
          include: {
            modulos: {
              include: {
                asistencias: true,
              },
            },
          },
        },
        asistencias: true, // Solo las asistencias relacionadas con el curso afectado
      },
    });

    // 6. Condición de error si no se obtuvo el curso verificado
    if (!nuevaAsistencia) {
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "ERROR_UPDATE_CURSO",
        id_objeto: validaciones.id_curso,
        id_usuario: validaciones.id_usuario,
        descripcion: `No se pudo verificar el curso id: ${validaciones.id_curso} del vocero id: ${validaciones.id_vocero}`,
        datosAntes: null,
        datosDespues: nuevaAsistencia,
      });

      return generarRespuesta("error", "Error, no se verifico...", {}, 400);
    } else {
      // 7. Condición de éxito: el curso fue verificado correctamente
      await registrarEventoSeguro(request, {
        tabla: "curso",
        accion: "UPDATE_CURSO",
        id_objeto: nuevaAsistencia?.voceros?.id
          ? nuevaAsistencia?.voceros?.id
          : 0,
        id_usuario: validaciones.id_usuario,
        descripcion: `Se verifico correctamente el curso id: ${validaciones.id_curso} con el vocero ${validaciones.id_vocero}`,
        datosAntes: null,
        datosDespues: nuevaAsistencia,
      });

      return generarRespuesta(
        "ok",
        "Verificado con exito...",
        {
          curso: nuevaAsistencia,
        },
        201
      );
    }
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (validar curso): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "curso",
      accion: "ERROR_INTERNO_CURSO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion:
        "Error inesperado al verificar el curso con un vocero determinado",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (validar curso)", {}, 500);
  }
}
