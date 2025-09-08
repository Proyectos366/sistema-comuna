/**
@fileoverview Controlador de API para la consulta de todas las novedades. Este archivo gestiona
la lógica de recuperación de las novedades almacenadas en la base de datos, validando la solicitud
previamente con un servicio especializado y retornando los datos transformados de manera estandarizada.
@module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para interactuar con la base de datos.
import validarConsultarTodasNovedades from "@/services/novedades/validarConsultarTodasNovedades"; // Servicio para validar la consulta de todas las novedades.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para construir respuestas uniformes hacia el frontend.

/**
Maneja las solicitudes HTTP GET para consultar todas las novedades disponibles.
@async
@function GET
@param {Request} request - Objeto de la solicitud entrante (no requiere parámetros específicos).
@returns {Promise<object>} - Una respuesta HTTP en formato JSON con la lista de novedades o un error.
*/

export async function GET() {
  try {
    // 1. Validación inicial de la consulta
    const validaciones = await validarConsultarTodasNovedades();

    // 2. Manejo de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta de novedades en la base de datos
    const novedades = await prisma.novedadDepartamento.findMany({
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
            },
          },
        },
        departamento: true,
      },
    });

    // 4. Transformación de datos obtenidos
    const resultado = novedades.map((novedadDepto) => {
      const novedad = novedadDepto.novedades;

      const esCreador = novedad.id_usuario === validaciones?.id_usuario;

      return {
        id: novedad.id,
        nombre: novedad.nombre,
        descripcion: novedad.descripcion,
        prioridad: novedad.prioridad,
        fechaCreacion: novedad.createdAt,
        fechaRecepcion: novedadDepto.fechaRecepcion,
        estatus: novedadDepto.estatus, // ya no usamos destinatario
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
    });

    // 5. Validación de resultados vacíos
    if (!resultado) {
      return generarRespuesta(
        "error",
        "Error, al consultar novedades...",
        { novedades: [] },
        201
      );
    }

    // 6. Respuesta exitosa con todas las novedades consultadas
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
