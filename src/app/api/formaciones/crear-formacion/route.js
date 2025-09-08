/**
@fileoverview Controlador de API para la creación de una nueva formación. Este archivo maneja
la lógica para crear una nueva formación en la base de datos a través de una solicitud POST.
Utiliza Prisma para la interacción con la base de datos, un servicio de validación para asegurar
la validez de los datos, y un sistema de registro de eventos para la auditoría.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearFormacion from "@/services/formaciones/validarCrearFormacion"; // Servicio para validar los datos de la nueva formación.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
/**
Maneja las solicitudes HTTP POST para crear una nueva formación.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los detalles de la formación a crear.@returns {Promise un error.
*/

export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { nombre, cantidadModulos, descripcion } = await request.json();

    // 2. Valida la información utilizando el servicio correspondiente
    const validaciones = await validarCrearFormacion(
      nombre,
      cantidadModulos,
      descripcion
    );

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "INTENTO_FALLIDO_FORMACION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validación fallida al intentar crear formación",
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

    // 4. Crea una nueva formación en la base de datos
    const nuevaFormacion = await prisma.formacion.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        id_usuario: validaciones.id_usuario,
        id_institucion: validaciones.id_institucion,
        id_departamento: validaciones.id_departamento,
        modulos: {
          connect: validaciones.todosModulos.map(({ id }) => ({ id })),
        },
      },
    });

    // 5. Condición de error si no se crea la formación
    if (!nuevaFormacion) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_CREAR_FORMACION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "No se pudo crear la formación",
        datosAntes: null,
        datosDespues: nuevaFormacion,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo la formacion",
        {},
        400
      );
    } else {
      // 6. Condición de éxito: la formación fue creada correctamente
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "CREAR_FORMACION",
        id_objeto: nuevaFormacion.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Formacion creada con exito",
        datosAntes: null,
        datosDespues: nuevaFormacion,
      });

      return generarRespuesta(
        "ok",
        "Formacion creada...",
        {
          formacion: nuevaFormacion,
        },
        201
      );
    }
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno (formaciones): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear formacion",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno (formaciones)", {}, 500);
  }
}
