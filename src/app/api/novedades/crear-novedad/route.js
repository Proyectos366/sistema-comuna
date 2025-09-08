/**
@fileoverview Controlador de API para la creación de una nueva novedad. Este archivo maneja la
lógica para crear una nueva novedad en la base de datos a través de una solicitud POST. Utiliza
Prisma para la interacción con la base de datos, un servicio de validación para asegurar la validez
de los datos. @module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearNovedad from "@/services/novedades/validarCrearNovedad"; // Servicio para validar los datos de la nueva novedad.
/**
Maneja las solicitudes HTTP POST para crear una nueva novedad.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles de la novedad a crear.@returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const {
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango,
      prioridad,
    } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearNovedad(
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango,
      prioridad
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    /** 
      const nuevaNovedad = await prisma.novedad.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          prioridad: validaciones.prioridad,
          id_usuario: validaciones.id_usuario,
          id_institucion: validaciones.id_institucion,
        },
      });

      // Crear relaciones con departamentos
      const noveDepa = await prisma.novedadDepartamento.createMany({
        data: {
          id_novedad: nuevaNovedad.id,
          id_departamento: validaciones.id_departamento,
        },
      });

      const nuevaNotificacion = await prisma.notificacion.create({
        data: {
          mensaje: validaciones.nombre,
          id_emisor: validaciones.id_depa_origen,
          id_receptor: validaciones.id_departamento,
        },
      });

      const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
      const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });
    */

    // 4. Consulta las novedades relacionadas en la base de datos
    const novedades = await prisma.novedadDepartamento.findMany({
      where: {
        id_novedad: validaciones.id_novedad,
        estatus: "pendiente",
        OR: [
          { fechaRecepcion: null },
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

    // 5. Transformación de los datos obtenidos para la respuesta
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

    // 6. Respuesta exitosa con las novedades generadas
    return generarRespuesta(
      "ok",
      "Novedad creada correctamente",
      { novedades: resultado },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.error("Error interno (novedades):", error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al crear la novedad",
      {},
      500
    );
  }
}
