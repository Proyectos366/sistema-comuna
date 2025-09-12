/**
@fileoverview Controlador de API para la creación de un nuevo estado. Este archivo maneja
la lógica para crear un nuevo estado en la base de datos a través de una solicitud POST.
Utiliza Prisma para la interacción con la base de datos, un servicio de validación para asegurar
la validez de los datos, y un sistema de registro de eventos para la auditoría.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarCrearEstado from "@/services/estados/validarCrearEstado"; // Servicio para validar los datos del nuevo estado.
/**
Maneja las solicitudes HTTP POST para crear un nuevo estado.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles del estado a crear.@returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, capital, codigoPostal, descripcion, id_pais } =
      await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearEstado(
      nombre,
      capital,
      codigoPostal,
      descripcion,
      id_pais
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "INTENTO_FALLIDO_ESTADO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear el estado",
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

    // 4. Crea un nuevo estado en la base de datos
    const nuevoEstado = await prisma.estado.create({
      data: {
        nombre: validaciones.nombre,
        capital: validaciones.capital,
        cod_postal: validaciones.codigoPostal,
        descripcion: validaciones.descripcion,
        serial: validaciones.serial,
        id_usuario: validaciones.id_usuario,
        id_pais: validaciones.id_pais,
      },
    });

    // 5. Consulta todos los países, estados, municipios y parroquias
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

    // 6. Condición de error si no se crea el estado
    if (!nuevoEstado) {
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "ERROR_CREAR_ESTADO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el estado",
        datosAntes: null,
        datosDespues: nuevoEstado,
      });

      return generarRespuesta("error", "Error, no se creo el estado", {}, 400);
    }

    // 7. Condición de éxito: el estado fue creado correctamente
    await registrarEventoSeguro(request, {
      tabla: "estado",
      accion: "CREAR_ESTADO",
      id_objeto: nuevoEstado.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Estado creado con exito",
      datosAntes: null,
      datosDespues: nuevoEstado,
    });

    return generarRespuesta(
      "ok",
      "Estado creado...",
      {
        estados: nuevoEstado,
        paises: todosPaises,
      },
      201
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (estados): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "estado",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear estado",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (estados)", {}, 500);
  }
}
