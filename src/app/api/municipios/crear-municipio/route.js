/**
@fileoverview Controlador de API para la creación de un nuevo municipio. Este archivo maneja la
lógica para crear un nuevo municipio en la base de datos a través de una solicitud POST. Utiliza
Prisma para la interacción con la base de datos, un servicio de validación para asegurar la validez
de los datos, y un sistema de registro de eventos para la auditoría. @module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarCrearMunicipio from "@/services/municipios/validarCrearMunicipio"; // Servicio para validar los datos del nuevo municipio.
/**
Maneja las solicitudes HTTP POST para crear un nuevo municipio.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles del municipio a crear.@returns {Promise - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, descripcion, id_pais, id_estado } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "INTENTO_FALLIDO_MUNICIPIO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear el municipio",
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

    // 4. Crea un nuevo municipio en la base de datos
    const nuevoMunicipio = await prisma.municipio.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        serial: validaciones.serial,
        id_usuario: validaciones.id_usuario,
        id_estado: validaciones.id_estado,
      },
    });

    // 5. Consulta todos los países, estados, municipios, parroquias e instituciones
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

    // 6. Condición de error si no se crea el municipio
    if (!nuevoMunicipio) {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "ERROR_CREAR_MUNICIPIO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el municipio",
        datosAntes: null,
        datosDespues: nuevoMunicipio,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo el municipio",
        {},
        400
      );
    } else {
      // 7. Condición de éxito: el municipio fue creado correctamente
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "CREAR_MUNICIPIO",
        id_objeto: nuevoMunicipio.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Municipio creado con exito",
        datosAntes: null,
        datosDespues: nuevoMunicipio,
      });

      return generarRespuesta(
        "ok",
        "Municipio creado...",
        {
          municipios: nuevoMunicipio,
          paises: todosPaises,
        },
        201
      );
    }
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (municipio): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "municipio",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear municipio",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (municipio)", {}, 500);
  }
}
