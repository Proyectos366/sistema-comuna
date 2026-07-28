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
import fs from "fs"; // Módulo de Node.js para manejar el sistema de archivos.
import path from "path"; // Módulo de Node.js para manejar rutas de archivos y directorios.

/**
 Maneja las solicitudes HTTP POST para crear un nuevo archivo.
 @async
 @function POST
 @param {object} request - El objeto de la solicitud HTTP (Next.js Request basado en Web API).
 @returns {Promise<object>} - Una respuesta HTTP en formato JSON con el resultado de la operación.
*/

export async function POST(request) {
  try {
    // 1. Valida los datos recibidos utilizando el servicio 'validarCrearArchivo'
    // NOTA: Este servicio ya guarda el archivo físicamente en su ubicación final
    const validaciones = await validarCrearArchivo(request);

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "archivos",
        accion: "INTENTO_FALLIDO_ARCHIVO",
        id_objeto: 0,
        id_usuario: validaciones.data?.id_usuario || 0,
        descripcion: "Validacion fallida al intentar crear un archivo",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        validaciones.data?.codigo || 400,
      );
    }

    // 4. Crea un nuevo archivo en la base de datos utilizando Prisma
    const nuevoArchivo = await prisma.$transaction(async (tx) => {
      // 4.1. Definir ruta definitiva del archivo
      const rutaDefinitiva = path.join(
        process.cwd(),
        validaciones.path,
        validaciones.nombreSistema,
      );

      // 4.2. Verificar si la carpeta de destino existe
      const carpetaDestino = path.dirname(rutaDefinitiva);
      if (!fs.existsSync(carpetaDestino)) {
        throw new Error(`La carpeta destino no existe: ${carpetaDestino}`);
      }

      // 4.3. Mover el archivo de temp a destino definitivo
      fs.renameSync(validaciones.rutaTemporal, rutaDefinitiva);

      const pathArchivo = `${validaciones.path}/${validaciones.nombreSistema}`;
      // 4.4. Crear el registro del archivo en la base de datos
      const archivo = await tx.archivo.create({
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          alias: validaciones.alias,
          nombre_original: validaciones.nombreOriginal,
          nombre_sistema: validaciones.nombreSistema,
          codigo: validaciones.codigo,
          hash: validaciones.hash,
          extension: validaciones.extension,
          tipo: validaciones.tipo,
          size: validaciones.size,
          path: pathArchivo,
          estado: true,
          borrado: false,
          id_departamento: validaciones.id_departamento,
          id_estante: validaciones.id_estante,
          id_carpeta: validaciones.id_carpeta,
          id_usuario: validaciones.id_usuario,
        },
      });

      // 4.5. Consultar el archivo que se acaba de crear
      const archivoCreado = await tx.archivo.findUnique({
        where: {
          id: archivo.id,
          borrado: false,
        },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          alias: true,
          nombre_original: true,
          nombre_sistema: true,
          codigo: true,
          hash: true,
          path: true,
          extension: true,
          tipo: true,
          size: true,
          borrado: true,
          createdAt: true,
        },
      });

      return archivoCreado;
    });

    // 5. Condición de error al crear el archivo en la base de datos
    if (!nuevoArchivo) {
      await registrarEventoSeguro(request, {
        tabla: "archivo",
        accion: "ERROR_CREAR_ARCHIVO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el archivo en la base de datos",
        datosAntes: null,
        datosDespues: nuevoArchivo,
      });

      return generarRespuesta("error", "Error, no se creó el archivo", {}, 400);
    }

    // 6. Condición de éxito: el archivo se creó correctamente
    await registrarEventoSeguro(request, {
      tabla: "archivo",
      accion: "CREAR_ARCHIVO",
      id_objeto: nuevoArchivo.id,
      id_usuario: validaciones.id_usuario,
      descripcion: "Archivo creado con exito",
      datosAntes: null,
      datosDespues: nuevoArchivo,
    });

    // 7. Retorna una respuesta de éxito con un código de estado 201 (Created)
    return generarRespuesta(
      "ok",
      "Archivo creado con exito",
      { archivos: nuevoArchivo },
      201,
    );
  } catch (error) {
    // 8. Manejo de errores inesperados (bloque catch)
    console.log(`Error interno crear archivo: ` + error);

    // Registra un evento de error interno en la bitácora
    await registrarEventoSeguro(request, {
      tabla: "archivo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear archivo",
      datosAntes: null,
      datosDespues: error.message,
    });

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error interno crear archivo", {}, 500);
  }
}
