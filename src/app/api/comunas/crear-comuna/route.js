/**
@fileoverview Controlador de API para la creación de una nueva comuna. Este archivo maneja la
lógica para crear una nueva comuna en la base de datosa través de una solicitud POST. Utiliza
Prisma para la interacción con la base de datos, un servicio de validación para asegurar la
validez de los datos, y un sistema de registro de eventos para la auditoría.
@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearComuna from "@/services/comunas/validarCrearComuna"; // Servicio para validar los datos de la nueva comuna.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
/**
  Maneja las solicitudes HTTP POST para crear una nueva comuna.
  @async@function POST@param {Request} request - Objeto de la solicitud que contiene los 
  detalles de la comuna a crear.@returns {Promise>} - Una respuesta HTTP en formato JSON 
  con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    /**
     // Esto sera para el futuro cuando se envien estos datos del front-end
     const {nombre, direccion, norte, sur, este, oeste, punto, rif, id_parroquia } = await request.json();
     */
    const { nombre, rif, codigo, id_parroquia } = await request.json();

    const { direccion, norte, sur, este, oeste, punto } = "";

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearComuna(
      nombre,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
      rif,
      codigo,
      id_parroquia
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "INTENTO_FALLIDO_COMUNA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear comuna",
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

    // 4. Crea una nueva comuna en la base de datos
    const nuevaComuna = await prisma.comuna.create({
      data: {
        nombre: validaciones.nombre,
        direccion: validaciones.direccion,
        norte: validaciones.norte,
        sur: validaciones.sur,
        este: validaciones.este,
        oeste: validaciones.oeste,
        punto: validaciones.punto,
        rif: `${new Date().getTime()}`,
        codigo: `${new Date().getTime()}`,
        borrado: false,
        id_usuario: validaciones.id_usuario,
        id_parroquia: validaciones.id_parroquia,
      },
    });

    // 5. Condición de error si no se crea la comuna
    if (!nuevaComuna) {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "ERROR_CREAR_COMUNA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear la comuna",
        datosAntes: null,
        datosDespues: nuevaComuna,
      });
      return generarRespuesta("error", "Error, no se creo la comuna", {}, 400);
    } else {
      // 6. Condición de éxito: la comuna fue creada correctamente
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "CREAR_COMUNA",
        id_objeto: nuevaComuna.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Comuna creada con exito",
        datosAntes: null,
        datosDespues: nuevaComuna,
      });

      return generarRespuesta(
        "ok",
        "Comuna creada...",
        {
          comunas: nuevaComuna,
        },
        201
      );
    }
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (comunas): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "comuna",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear comuna",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (comunas)", {}, 500);
  }
}
