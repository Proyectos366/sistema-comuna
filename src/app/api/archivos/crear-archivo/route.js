/**
 @fileoverview Controlador de API para la creación de un archivo. Este archivo maneja la lógica para
 registrar un nuevo archivo en la base de datos a través de una solicitud POST. Utiliza Prisma para
 interactuar con la base de datos, un sistema de validación para verificar los datos de entrada y un
 mecanismo de registro de eventos para mantener una bitácora de seguridad. @module
*/

// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarCrearArchivo from "@/services/archivos/validarCrearArchivo"; // Servicio para validar los datos de entrada del archivo.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad en la base de datos.
import { CrearCarpetasStorage } from "@/utils/crearRutaCarpetasStorage";
import path from "path"; // Módulo de Node.js para manejar rutas de archivos y directorios.
import procesarDetallesCarpeta from "@/utils/procesarDetallesCarpeta";

/**
 Maneja las solicitudes HTTP POST para crear un nuevo archivo.
 @async
 @function POST
 @param {object} request - El objeto de la solicitud HTTP (Next.js Request basado en Web API).
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación.
*/

export async function POST(request) {
  try {
    // 1.Instancia para crear carpetas en el storage
    const crearRutasCarpetas = new CrearCarpetasStorage();

    // 2. Valida los datos recibidos utilizando el servicio 'validarCrearArchivo'
    const validaciones = await validarCrearArchivo(request);

    // 3. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "archivos",
        accion: "INTENTO_FALLIDO_ARCHIVO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear un archivo",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.codigo ? validaciones.codigo : 400,
      );
    }

    console.log(validaciones);

    return generarRespuesta(
      "error",
      "Carpeta creada con exito",
      { carpetas: [] },
      201,
    );
    

    // // 4. Crea un nuevo archivo en la base de datos utilizando Prisma
    // const nuevoArchivo = await prisma.$transaction(async (tx) => {
    //   // 4.1. Función para crear el archivo en la base de datos
    //   const carpeta = await tx.archivo.create({
    //     data: {
    //       nombre: validaciones.nombre,
    //       descripcion: validaciones.descripcion,
    //       alias: validaciones.alias,
    //       nombre_original: validaciones.nombreOriginal,
    //       nombre_sistema: validaciones.nombreSistema,
    //       codigo: validaciones.codigo,
    //       hash: validaciones.hash,
    //       extension: validaciones.extension,
    //       tipo: validaciones.tipo,
    //       size: validaciones.size,
    //       path: validaciones.path,
    //       estado: validaciones.estado,
    //       id_departamento: validaciones.id_departamento,
    //       id_estante: validaciones.id_estante,
    //       id_carpeta: validaciones.id_carpeta,
    //       id_usuario: validaciones.id_usuario,
    //     },
    //   });

     

    //   // 4.2. Intentar crear la carpeta física
    //   try {
    //     const storagePath = path.join(
    //       process.cwd(),
    //       `storage/instituciones/${validaciones.nombreInstitucion}/${validaciones.nombreDepartamento}/${validaciones.nombreEstante}`,
    //     );

    //     await crearRutasCarpetas.crearCarpeta(storagePath, validaciones.alias);
    //   } catch (error) {
    //     throw new Error(
    //       "Error al crear carpeta dentro de estante: " + error.message,
    //     );
    //   }

    //   // 4.3. Consultar SOLO el archivo que se acaba de crear
    //   const carpetaCreada = await tx.carpeta.findUnique({
    //     where: {
    //       id: carpeta.id,
    //       borrado: false,
    //     },
    //     include: {
    //       archivos: {
    //         select: {
    //           id: true,
    //           nombre: true,
    //           descripcion: true,
    //           size: true, // Para sumar el peso
    //         },
    //         orderBy: {
    //           nombre: "asc",
    //         },
    //       },
    //       _count: {
    //         select: {
    //           archivos: true, // Única vez que contamos los archivos
    //         },
    //       },
    //     },
    //   });

    //   // 4.4. Asegurarnos de que archivos sea un array aunque esté vacío
    //   const carpetaConArrays = {
    //     ...carpetaCreada,
    //     archivos: carpetaCreada?.archivos || [],
    //     _count: carpetaCreada?._count || { archivos: 0 },
    //   };

    //   // 4.5. Calcular el peso total de los archivos
    //   const pesoTotal = carpetaConArrays.archivos.reduce(
    //     (suma, archivo) => suma + (archivo.size || 0),
    //     0,
    //   );

    //   // 4.6. Añadir el peso total al objeto
    //   const carpetaConPeso = {
    //     ...carpetaConArrays,
    //     pesoTotal,
    //   };

    //   // 4.7. Procesar la carpeta
    //   const carpetaProcesada = procesarDetallesCarpeta([carpetaConPeso]);

    //   // 4.8. Retornar el primer elemento
    //   return carpetaProcesada[0];
    // });

    // // 6. Condición de error al crear la carpeta en la base de datos
    // if (!nuevoArchivo) {
    //   await registrarEventoSeguro(request, {
    //     tabla: "carpeta",
    //     accion: "ERROR_CREAR_CARPETA",
    //     id_objeto: 0,
    //     id_usuario: validaciones.id_usuario,
    //     descripcion: "No se pudo crear la carpeta",
    //     datosAntes: null,
    //     datosDespues: nuevoArchivo,
    //   });

    //   // Retorna una respuesta de error con un código de estado 400
    //   return generarRespuesta("error", "Error, no se creo la carpeta", {}, 400);
    // }

    // // 7. Condición de éxito: la carpeta se creó correctamente
    // await registrarEventoSeguro(request, {
    //   tabla: "carpeta",
    //   accion: "CREAR_CARPETA",
    //   id_objeto: nuevoArchivo.id,
    //   id_usuario: validaciones.id_usuario,
    //   descripcion: "Carpeta creada con exito",
    //   datosAntes: null,
    //   datosDespues: nuevoArchivo,
    // });

    // // 8. Retorna una respuesta de éxito con un código de estado 201 (Created)
    // return generarRespuesta(
    //   "ok",
    //   "Carpeta creada con exito",
    //   { carpetas: nuevoArchivo },
    //   201,
    // );
  } catch (error) {
    // 9. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno crear carpeta: ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "carpeta",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear carpeta",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error, interno crear carpeta", {}, 500);
  }
}
