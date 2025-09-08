/**
@fileoverview Controlador de API para la edición de un municipio existente. Este archivo maneja
la lógica para actualizar los detalles de un municipio en la base de datos a través de una
solicitud POST. Utiliza Prisma para la interacción con la base de datos, un servicio de validación
para asegurar la validez de los datos, y un sistema de registro de eventos para la auditoría. @module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarMunicipio from "@/services/municipios/validarEditarMunicipio"; // Servicio para validar los datos de edición del municipio.
/**
Maneja las solicitudes HTTP POST para editar un municipio existente.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles del municipio a editar.@returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, descripcion, id_pais, id_estado, id_municipio } =
      await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "INTENTO_FALLIDO_MUNICIPIO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar el municipio",
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

    // 4. Actualiza el municipio en la base de datos
    const [actualizado, municipioActualizado] = await prisma.$transaction([
      prisma.municipio.update({
        where: { id: validaciones.id_municipio },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.municipio.findFirst({
        where: {
          id: validaciones.id_municipio,
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
              },
            },
          },
        },
      },
    });

    // 6. Condición de error si no se actualiza el municipio
    if (!municipioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "ERROR_UPDATE_MUNICIPIO",
        id_objeto: validaciones.id_municipio,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el municipio",
        datosAntes: { nombre, descripcion, id_pais, id_estado, id_municipio },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, no se actualizado el municipio",
        {},
        400
      );
    } else {
      // 6. Condición de éxito: el municipio fue actualizado correctamente
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "UPDATE_MUNICIPIO",
        id_objeto: municipioActualizado?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Municipio actualizado con exito id: ${validaciones.id_municipio}`,
        datosAntes: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          id_pais: validaciones.id_pais,
          id_estado: validaciones.id_estado,
          id_municipio: validaciones.id_municipio,
        },
        datosDespues: municipioActualizado,
      });

      return generarRespuesta(
        "ok",
        "Municipio actualizado...",
        { municipios: municipioActualizado, paises: todosPaises },
        201
      );
    }
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (actualizar municipio): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "municipio",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el municipio",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar municipio)",
      {},
      500
    );
  }
}
