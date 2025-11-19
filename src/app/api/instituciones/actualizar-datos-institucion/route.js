/**
  @fileoverview Controlador de API para la edición de una institución existente. Este archivo
  maneja la lógica para actualizar los detalles de una institución en la base de datos a través
  de una solicitud PATCH. Utiliza Prisma para la interacción con la base de datos, un servicio de
  validación para asegurar la validez de los datos, y un sistema de registro de eventos para la
  auditoría.@module /api/instituciones/actualizar-datos-institucion
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarInstitucion from "@/services/instituciones/validarEditarInstitucion"; // Servicio para validar los datos de edición de la institución.
/**
  Maneja las solicitudes HTTP PATCH para editar una institución existente.
  @async@function PATCH@param {Request} request - Objeto de la solicitud que contiene los detalles
  de la institución a editar.@returns {Promise<object>} - Una respuesta HTTP en formato JSON con
  el resultado de la operación o un error.
*/

export async function PATCH(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const {
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia,
      id_institucion,
    } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia,
      id_institucion
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "INTENTO_FALLIDO_INSTITUCION",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar la institución",
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

    // 4. Actualiza la institución en la base de datos
    const [actualizada, institucionActualizada] = await prisma.$transaction([
      prisma.institucion.update({
        where: { id: validaciones.id_institucion },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          rif: validaciones.rif,
          sector: validaciones.sector,
          direccion: validaciones.direccion,
          id_parroquia: validaciones.id_parroquia,
        },
      }),

      prisma.institucion.findFirst({
        where: {
          id: validaciones.id_institucion,
          borrado: false,
        },
      }),
    ]);

    // 5. Consultar paises, estados, municipios, parroquias e instituciones
    const todosPaises = await prisma.pais.findMany({
      where: {
        borrado: false,
      },
      include: {
        estados: {
          include: {
            municipios: {
              include: {
                parroquias: true,
                instituciones: true,
              },
            },
          },
        },
      },
    });

    // 6. Condición de error si no se actualiza la institución
    if (!institucionActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "ERROR_UPDATE_INSTITUCION",
        id_objeto: validaciones.id_institucion,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la institución",
        datosAntes: {
          nombre,
          descripcion,
          rif,
          sector,
          direccion,
          id_institucion,
        },
        datosDespues: actualizada,
      });

      return generarRespuesta(
        "error",
        "Error, al actualizar institucion",
        {},
        400
      );
    }

    // 6. Condición de éxito: la institución fue actualizada correctamente
    await registrarEventoSeguro(request, {
      tabla: "institucion",
      accion: "UPDATE_INSTITUCION",
      id_objeto: institucionActualizada?.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Institucion actualizada con exito id: ${validaciones.id_institucion}`,
      datosAntes: {
        nombre: nombre,
        descripcion: descripcion,
        rif: rif,
        sector: sector,
        direccion: direccion,
        id_institucion: id_institucion,
      },
      datosDespues: institucionActualizada,
    });

    return generarRespuesta(
      "ok",
      "Institución actualizada...",
      { instituciones: institucionActualizada, paises: todosPaises },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (actualizar institucion): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "institucion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la institucion",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar institucion)",
      {},
      500
    );
  }
}
