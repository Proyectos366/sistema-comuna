/**
@fileoverview Controlador de API para la consulta de todas las novedades de un departamento. 
Este archivo se encarga de obtener las novedades pendientes asociadas a un departamento 
específico, validando primero la solicitud y retornando los datos en un formato estructurado.
@module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión con la base de datos.
import validarConsultarTodasNovedadesDepartamento from "@/services/novedades/validarConsultarTodasNovedadesDepartamento"; // Servicio de validación para la consulta de novedades de un departamento.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas estandarizadas.

/**
Maneja las solicitudes HTTP GET para consultar todas las novedades asociadas a un departamento.
@async
@function GET
@returns {Promise<object>} - Una respuesta HTTP en formato JSON con la lista de novedades del departamento o un error.
*/

export async function GET() {
  try {
    // 1. Validación inicial de la consulta
    const validaciones = await validarConsultarTodasNovedadesDepartamento();

    // 2. Respuesta en caso de error de validación
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta de novedades filtradas por departamento
    const novedades = await prisma.novedadDepartamento.findMany({
      where: {
        id_departamento: validaciones.id_departamento,
        estatus: "pendiente",
        OR: [
          {
            fechaRecepcion: null,
          },
          {
            fechaRecepcion: {
              gte: validaciones.inicioSemana,
              lte: validaciones.finSemana,
            },
          },
        ],
      },
      include: {
        novedades: {
          include: {
            usuarios: true,
            institucion: true,
            departamento: true,
            destinatarios: {
              include: {
                departamento: true,
              },
              orderBy: {
                fechaRecepcion: "desc",
              },
            },
          },
        },
        departamento: true,
      },
    });

    // 4. Transformación de los datos obtenidos
    const resultado = novedades
      .map((novedadDepto) => {
        if (!novedadDepto.novedades) return null;
        const novedad = novedadDepto.novedades;

        const esCreador = novedad.id_usuario === validaciones.id_usuario;

        const destinatario = novedad.destinatarios.find(
          (d) => d.departamento.id === validaciones.id_departamento
        );

        return {
          id: novedad.id,
          nombre: novedad.nombre,
          descripcion: novedad.descripcion,
          prioridad: novedad.prioridad,
          fechaCreacion: novedad.createdAt,
          fechaRecepcion: novedadDepto.fechaRecepcion,
          estatus: destinatario?.estatus || novedadDepto.estatus,
          vista: esCreador ? "creador" : "destinatario",

          creador: {
            id: novedad.usuarios.id,
            nombre: novedad.usuarios.nombre,
          },

          institucion: novedad.institucion
            ? {
                id: novedad.institucion.id,
                nombre: novedad.institucion.nombre,
              }
            : null,

          departamentoReceptor: {
            id: novedadDepto.departamento.id,
            nombre: novedadDepto.departamento.nombre,
            descripcion: novedadDepto.departamento.descripcion,
          },
        };
      })
      .filter(Boolean);

    // 5. Validación de resultados vacíos
    if (!novedades) {
      return generarRespuesta(
        "error",
        "Error, al consultar novedades...",
        {},
        400
      );
    }

    // 6. Respuesta exitosa con las novedades del departamento
    return generarRespuesta(
      "ok",
      "Todas las novedades...",
      {
        novedades: resultado,
      },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno consultar (novedades): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (novedades)",
      {},
      500
    );
  }
}
