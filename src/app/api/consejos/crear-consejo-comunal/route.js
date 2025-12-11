/**
  @fileoverview Controlador de API para la creación de un nuevo consejo comunal.
  Este archivo maneja la lógica para crear un nuevo consejo comunal en la base de datosa través
  de una solicitud POST. Utiliza Prisma para la interacción con la base de datos, un servicio de
  validaciónpara asegurar la validez de los datos, y un sistema de registro de eventos para la
  auditoría. @module
*/

import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearConsejoComunal from "@/services/consejos-comunales/validarCrearConsejoComunal"; // Servicio para validar los datos del nuevo consejo comunal.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
/**
  Maneja las solicitudes HTTP POST para crear un nuevo consejo comunal.
  @async
  @function POST
  @param {Request} request - Objeto de la solicitud que contiene los detalles del consejo comunal a crear.
  @returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, descripcion, id_parroquia, id_comuna, id_circuito } =
      await request.json();

    // Inicializa propiedades adicionales que no se utilizan.
    const { direccion, norte, sur, este, oeste, punto, rif, codigo } = "";

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearConsejoComunal(
      nombre,
      descripcion,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
      rif,
      codigo,
      id_parroquia,
      id_comuna,
      id_circuito
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "INTENTO_FALLIDO_CONSEJO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear consejo comunal",
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

    // 4. Crea un nuevo consejo comunal en la base de datos
    const nuevoConsejoComunal = await prisma.consejo.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        direccion: validaciones.direccion,
        norte: validaciones.norte,
        sur: validaciones.sur,
        este: validaciones.este,
        oeste: validaciones.oeste,
        punto: validaciones.punto,
        rif: `C-${Date.now()}`,
        codigo: `${new Date().getTime()}`,
        id_usuario: validaciones.id_usuario,
        id_parroquia: validaciones.id_parroquia,
        id_comuna: validaciones.id_comuna,
        id_circuito: validaciones.id_circuito,
      },
    });

    // 5. Condición de error si no se crea el consejo comunal
    if (!nuevoConsejoComunal) {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_CREAR_CONSEJO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el consejo comunal",
        datosAntes: null,
        datosDespues: nuevoConsejoComunal,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo el consejo comunal...",
        {},
        400
      );
    }

    // 6. Condición de éxito: el consejo comunal fue creado correctamente
    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "CREAR_CONSEJO",
      id_objeto: nuevoConsejoComunal.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Consejo comunal creado con exito",
      datosAntes: null,
      datosDespues: nuevoConsejoComunal,
    });

    return generarRespuesta(
      "ok",
      "Consejo comunal creado...",
      {
        consejos: nuevoConsejoComunal,
      },
      201
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (consejo comunal): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear consejo comunal",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno (consejo comunal)",
      {},
      500
    );
  }
}
