/**
 @fileoverview Controlador de API para la creación de un estante. Este archivo maneja la lógica para
 registrar un nuevo estante en la base de datos a través de una solicitud POST. Utiliza Prisma para
 interactuar con la base de datos, un sistema de validación para verificar los datos de entrada y un
 mecanismo de registro de eventos para mantener una bitácora de seguridad. @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearEstante from "@/services/estantes/validarCrearEstante"; // Servicio para validar los datos de entrada del estante.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad en la base de datos.
import { CrearCarpetasStorage } from "@/utils/crearRutaCarpetasStorage";
import path from "path"; // Módulo de Node.js para manejar rutas de archivos y directorios.
import procesarDetallesEstante from "@/utils/procesarDetallesEstante";

/**
 Maneja las solicitudes HTTP POST para crear un nuevo estante.
 @async
 @function POST
 @param {object} request - El objeto de la solicitud HTTP (Next.js Request basado en Web API).
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación.
*/

export async function POST(request) {
  try {
    // 1.Instancia para crear carpetas en el storage
    const crearRutasCarpetas = new CrearCarpetasStorage();

    // 2. Obtiene los datos del cuerpo de la solicitud (request)
    const { nombre, descripcion, alias, niveles, secciones, cabecera } =
      await request.json();

    // 3. Valida los datos recibidos utilizando el servicio 'validarCrearEstante'
    const validaciones = await validarCrearEstante(
      nombre,
      descripcion,
      alias,
      niveles,
      secciones,
      cabecera,
    );

    // 4. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "estante",
        accion: "INTENTO_FALLIDO_ESTANTE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear un estante",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 5. Crea un nuevo estante en la base de datos utilizando Prisma
    const nuevoEstante = await prisma.$transaction(async (tx) => {
      // 5.1 Funcion para crear el estante
      const estante = await tx.estante.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          alias: validaciones.alias,
          nivel: validaciones.niveles,
          seccion: validaciones.secciones,
          cabecera: validaciones.cabecera,
          codigo: validaciones.codigo,
          id_institucion: validaciones.id_institucion,
          id_departamento: validaciones.id_departamento,
          id_usuario: validaciones.id_usuario,
        },
      });

      // 5.2 Intentar crear la carpeta física
      try {
        const storagePath = path.join(
          process.cwd(),
          `storage/instituciones/${validaciones.nombreInstitucion}/${validaciones.nombreDepartamento}`,
        );

        await crearRutasCarpetas.crearCarpeta(storagePath, validaciones.nombre);
      } catch (error) {
        // Si falla la carpeta, lanzamos error para que se revierta la transacción
        throw new Error("Error al crear carpeta de estante: " + error.message);
      }

      // 5.3 Consultar SOLO el estante que se acaba de crear
      const estanteCreado = await tx.estante.findUnique({
        where: {
          id: estante.id,
          borrado: false,
        },
        include: {
          carpetas: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              nivel: true,
              seccion: true,
              _count: {
                select: {
                  archivos: true,
                },
              },
            },
            orderBy: {
              nombre: "asc",
            },
          },
          archivos: {
            select: {
              id: true,
              size: true,
            },
          },
          _count: {
            select: {
              carpetas: true,
              archivos: true,
            },
          },
        },
      });

      // 5.5 Asegurarnos de que carpetas sea un array aunque esté vacío
      const estanteConCarpetasArray = {
        ...estanteCreado,
        carpetas: estanteCreado.carpetas || [], // Si es undefined, lo convertimos en array vacío
        archivos: estanteCreado.archivos || [], // También aseguramos archivos
        _count: estanteCreado._count || { carpetas: 0, archivos: 0 }, // Aseguramos _count
      };

      // 5.5 Procesar el estante individual
      const estanteProcesado = procesarDetallesEstante([
        estanteConCarpetasArray,
      ]);

      // 5.6 Retornar el primer elemento
      return estanteProcesado[0];
    });

    // 6. Condición de error al crear el estante en la base de datos
    if (!nuevoEstante) {
      await registrarEventoSeguro(request, {
        tabla: "estante",
        accion: "ERROR_CREAR_ESTANTE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el estante",
        datosAntes: null,
        datosDespues: nuevoEstante,
      });

      // Retorna una respuesta de error con un código de estado 400
      return generarRespuesta("error", "Error, no se creo el estante", {}, 400);
    }

    // 7. Condición de éxito: el estante se creó correctamente
    await registrarEventoSeguro(request, {
      tabla: "estante",
      accion: "CREAR_ESTANTE",
      id_objeto: nuevoEstante.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Estante creado con exito",
      datosAntes: null,
      datosDespues: nuevoEstante,
    });

    // 8. Retorna una respuesta de éxito con un código de estado 201 (Created)
    return generarRespuesta(
      "ok",
      "Estante creado",
      { estantes: nuevoEstante },
      201,
    );
  } catch (error) {
    // 9. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno crear estante: ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "estante",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear estante",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno crear estante", {}, 500);
  }
}
