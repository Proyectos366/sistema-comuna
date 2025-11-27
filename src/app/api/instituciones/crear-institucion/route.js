/**
@fileoverview Controlador de API para la creación de una nueva institución. Este archivo maneja
la lógica para crear una nueva institución en la base de datos a través de una solicitud POST.
Utiliza Prisma para la interacción con la base de datos, un servicio de validación para asegurar
la validez de los datos, y un sistema de registro de eventos para la auditoría.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import validarCrearInstitucion from "@/services/instituciones/validarCrearInstitucion"; // Servicio para validar los datos de la nueva institución.
import { CrearCarpetasStorage } from "@/utils/crearRutaCarpetasStorage";
/**
Maneja las solicitudes HTTP POST para crear una nueva institución.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles de la institución a crear.@returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación o un error.
*/

export async function POST(request) {
  try {
    // 1. Instancia para crear carpetas en el storage
    const crearRutasCarpetas = new CrearCarpetasStorage();

    // 2. Extrae datos de la solicitud JSON
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
    } = await request.json();

    // 3. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia
    );

    // 4. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "INTENTO_FALLIDO_INSTITUCION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear institucion",
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

    // 5. Crea una nueva institución en la base de datos
    const nuevaInstitucion = await prisma.$transaction(async (tx) => {
      const institucion = await tx.institucion.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          rif: validaciones.rif,
          sector: validaciones.sector,
          direccion: validaciones.direccion,
          id_pais: validaciones.id_pais,
          id_estado: validaciones.id_estado,
          id_municipio: validaciones.id_municipio,
          id_usuario: validaciones.id_usuario,
          id_parroquia: validaciones.id_parroquia,
        },
      });

      // 5. Intentar crear la carpeta
      try {
        await crearRutasCarpetas.crearCarpeta(validaciones.nombre);
      } catch (error) {
        // Si falla la carpeta, lanzamos error para que se revierta la transacción
        throw new Error(
          "Error al crear carpeta de institución: " + error.message
        );
      }

      return institucion;
    });

    // 6. Condición de error si no se crea la institución
    if (!nuevaInstitucion) {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "ERROR_CREAR_INSTITUCION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear la institucion",
        datosAntes: null,
        datosDespues: nuevaInstitucion,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo la institucion",
        {},
        400
      );
    }

    // 7. Condición de éxito: la institución fue creada correctamente
    await registrarEventoSeguro(request, {
      tabla: "institucion",
      accion: "CREAR_INSTITUCION",
      id_objeto: nuevaInstitucion.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Institucion creada con exito",
      datosAntes: null,
      datosDespues: nuevaInstitucion,
    });

    return generarRespuesta(
      "ok",
      "Institución creada...",
      {
        instituciones: nuevaInstitucion,
      },
      201
    );
  } catch (error) {
    // 8. Manejo de errores inesperados
    console.log(`Error interno (institucion): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "institucion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear institucion",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (institucion)", {}, 500);
  }
}
