/**
  @fileoverview Controlador de API para la creación de un nuevo departamento. Este archivo maneja la
  lógica para crear un nuevo departamento en la base de datos a través de una solicitud POST. Utiliza
  Prisma para la interacción con la base de datos, un servicio de validación para asegurar la validez
  de los datos, y un sistema de registro de eventos para la auditoría.@module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearDepartamento from "@/services/departamentos/validarCrearDepartamento"; // Servicio para validar los datos del nuevo departamento.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
/**
  Maneja las solicitudes HTTP POST para crear un nuevo departamento.
  @async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles del departamento a crear.
  @returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1.Instancia para crear carpetas en el storage
    const crearRutasCarpetas = new CrearCarpetasStorage();

    // 2. Extrae datos de la solicitud JSON
    const { nombre, descripcion, id_institucion } = await request.json();

    // 3. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearDepartamento(
      nombre,
      descripcion,
      id_institucion
    );

    // 4. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "INTENTO_FALLIDO_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear departamento",
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

    // 5. Crea un nuevo departamento en la base de datos
    const nuevoDepartamento = await prisma.$transaction(async (tx) => {
      const departamento = await tx.departamento.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          id_usuario: validaciones.id_usuario,
          id_institucion: validaciones.id_institucion,
        },
      });

      // 6. Intentar crear la carpeta
      try {
        await crearRutasCarpetas.crearCarpeta(validaciones.nombre);
      } catch (error) {
        // Si falla la carpeta, lanzamos error para que se revierta la transacción
        throw new Error(
          "Error al crear carpeta de departamento: " + error.message
        );
      }

      return departamento;
    });

    // 5. Condición de error si no se crea el departamento
    if (!nuevoDepartamento) {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "ERROR_CREAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el departamento",
        datosAntes: null,
        datosDespues: nuevoDepartamento,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo el departamento...",
        {},
        400
      );
    }

    // 7. Condición de éxito: el departamento fue creado correctamente
    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "CREAR_DEPARTAMENTO",
      id_objeto: nuevoDepartamento.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Departamento creado con exito",
      datosAntes: null,
      datosDespues: nuevoDepartamento,
    });

    return generarRespuesta(
      "ok",
      "Departamento creado...",
      {
        departamentos: nuevoDepartamento,
      },
      201
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (departamento)", {}, 500);
  }
}
