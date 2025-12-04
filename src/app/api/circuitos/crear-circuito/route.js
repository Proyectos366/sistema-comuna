/**
  @fileoverview Controlador de API para la creación de un nuevo circuito. Este archivo maneja la
  lógica para crear un nuevo circuito en la base de datos a través de una solicitud POST. Utiliza
  Prisma para la interacción con la base de datos, un servicio de validación para asegurar la
  validez de los datos, y un sistema de registro de eventos para la auditoría.
  @module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearCircuito from "@/services/circuitos/validarCrearCircuito"; // Servicio para validar los datos del nuevo circuito.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.

/**
  Maneja las solicitudes HTTP POST para crear un nuevo circuito.
  @async@function POST
  @param {Request} request - Objeto de la solicitud que contiene los detalles del circuito a crear.
  @returns {Promise>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    /**
     // Esto sera para el futuro cuando se envien estos datos del front-end
     const {nombre, codigo, direccion, norte, sur, este, oeste, punto, id_parroquia } = await request.json();
    */
    const { nombre, codigo, id_parroquia } = await request.json();

    const { direccion, norte, sur, este, oeste, punto } = "";

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearCircuito(
      nombre,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
      codigo,
      id_parroquia
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "circuito",
        accion: "INTENTO_FALLIDO_CIRCUITO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear circuito",
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

    // 4. Crea un nuevo circuito en la base de datos
    const nuevoCircuito = await prisma.circuito.create({
      data: {
        nombre: validaciones.nombre,
        direccion: validaciones.direccion,
        norte: validaciones.norte,
        sur: validaciones.sur,
        este: validaciones.este,
        oeste: validaciones.oeste,
        punto: validaciones.punto,
        codigo: `${new Date().getTime()}`,
        id_usuario: validaciones.id_usuario,
        id_parroquia: validaciones.id_parroquia,
      },
    });

    // 5. Condición de error si no se crea el circuito
    if (!nuevoCircuito) {
      await registrarEventoSeguro(request, {
        tabla: "circuito",
        accion: "ERROR_CREAR_CIRCUITO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear eL circuito",
        datosAntes: null,
        datosDespues: nuevoCircuito,
      });
      return generarRespuesta(
        "error",
        "Error, no se creo eL circuito",
        {},
        400
      );
    }

    // 6. Condición de éxito: eL circuito fue creado correctamente
    await registrarEventoSeguro(request, {
      tabla: "circuito",
      accion: "CREAR_CIRCUITO",
      id_objeto: nuevoCircuito.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Circuito creado con exito",
      datosAntes: null,
      datosDespues: nuevoCircuito,
    });

    return generarRespuesta(
      "ok",
      "Circuito creado...",
      {
        circuitos: nuevoCircuito,
      },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (circuitos): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "circuito",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear circuito",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (circuitos)", {}, 500);
  }
}
