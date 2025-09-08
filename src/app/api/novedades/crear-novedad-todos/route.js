/**
@fileoverview Controlador de API para la creación de novedades múltiples. Este archivo maneja la
lógica para crear una novedad destinada a varios departamentos de forma simultánea. Utiliza Prisma
para la interacción con la base de datos, servicios de validación específicos para este flujo y una
utilidad que estandariza las respuestas al cliente.
@module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión con la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para generar respuestas consistentes hacia el frontend.
import validarCrearNovedad from "@/services/novedades/validarCrearNovedad"; // Servicio de validación de datos de una nueva novedad.
import validarCrearNovedadTodos from "@/services/novedades/validarCrearNovedadTodos"; // Servicio de validación para creación de novedades múltiples.

/**
Maneja las solicitudes HTTP POST para crear novedades que afectan a múltiples departamentos.
@async
@function POST
@param {Request} request - Objeto de la solicitud que contiene los detalles de la novedad a crear.
@returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos del cuerpo de la solicitud
    const {
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango,
      prioridad,
    } = await request.json();

    // 2. Valida la información base de la novedad
    const validaciones = await validarCrearNovedad(
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango,
      prioridad
    );

    // 3. Responde en caso de error de validación inicial
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 4. Valida la información específica para creación múltiple
    const validacionesCrear = await validarCrearNovedadTodos(validaciones);

    // 5. Consulta en la base de datos las novedades relacionadas
    const novedades = await prisma.novedadDepartamento.findMany({
      where: {
        id_novedad: validacionesCrear.id_novedad,
        estatus: "pendiente",
        OR: [
          { fechaRecepcion: null },
          {
            fechaRecepcion: {
              gte: validacionesCrear.inicioSemana,
              lte: validacionesCrear.finSemana,
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

    // 6. Transformación de los datos para la respuesta
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

    // 7. Respuesta exitosa con las novedades procesadas
    return generarRespuesta(
      "ok",
      "Novedad creada correctamente",
      { novedades: resultado },
      201
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.error("Error interno (todas novedades):", error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al crear todas novedades",
      {},
      500
    );
  }
}
