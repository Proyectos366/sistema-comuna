/**
@fileoverview Controlador de API para la edición de un estado existente. Este archivo maneja la
lógica para actualizar los detalles de un estado en la base de datos a través de una solicitud POST.
Utiliza Prisma para la interacción con la base de datos, un servicio de validación para asegurar
la validez de los datos, y un sistema de registro de eventos para la auditoría.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarEditarEstado from "@/services/estados/validarEditarPais"; // Servicio para validar los datos de edición del estado.
/**
Maneja las solicitudes HTTP POST para editar un estado existente.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles del estado a editar.@returns {Promise>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, capital, codigoPostal, descripcion, id_pais, id_estado } =
      await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarEditarEstado(
      nombre,
      capital,
      codigoPostal,
      descripcion,
      id_pais,
      id_estado
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "INTENTO_FALLIDO_ESTADO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar el estado",
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

    // 4. Actualiza el estado en la base de datos
    const [actualizado, estadoActualizado] = await prisma.$transaction([
      prisma.estado.update({
        where: { id: validaciones.id_estado },
        data: {
          nombre: validaciones.nombre,
          capital: validaciones.capital,
          cod_postal: validaciones.codigoPostal,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.estado.findFirst({
        where: {
          id: validaciones.id_estado,
          borrado: false,
        },
      }),
    ]);

    // 5. Consulta de paises, estados, municipios y parroquias
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

    // 6. Condición de error si no se actualiza el estado
    if (!estadoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "ERROR_UPDATE_ESTADO",
        id_objeto: validaciones.id_estado,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el estado",
        datosAntes: { nombre, capital, descripcion, id_pais, id_estado },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar el estado actualizado",
        {},
        400
      );
    } else {
      // 7. Condición de éxito: el estado fue actualizado correctamente
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "UPDATE_ESTADO",
        id_objeto: estadoActualizado[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Estado actualizado con exito id: ${validaciones.id_estado}`,
        datosAntes: {
          nombre: validaciones.nombre,
          capital: validaciones.capital,
          codigoPostal: validaciones.codigoPostal,
          descripcion: validaciones.descripcion,
          id_pais: validaciones.id_pais,
          id_estado: validaciones.id_estado,
        },
        datosDespues: estadoActualizado,
      });

      return generarRespuesta(
        "ok",
        "Estado actualizado...",
        { estados: estadoActualizado, paises: todosPaises },
        201
      );
    }
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (actualizar estado): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "estado",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el estado",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (actualizar estado)",
      {},
      500
    );
  }
}
