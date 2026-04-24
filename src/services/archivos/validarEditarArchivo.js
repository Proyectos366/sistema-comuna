/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de edición de un archivo en la base de datos. @module services/archivos/validarEditarArchivo
*/

import prisma from "@/libs/prisma";
import ValidarCampos from "@/services/ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken";

export default async function validarEditarArchivo(
  nombre,
  descripcion,
  id_archivo,
) {
  try {
    // 1. Obtener y validar el correo del usuario desde el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar los campos de entrada.
    const validandoCampos = ValidarCampos.validarCamposEditarArchivo(
      nombre,
      descripcion,
      id_archivo,
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        },
      );
    }

    // 5. Verificar que el archivo existe y el usuario pertenece al departamento
    const archivoActual = await prisma.archivo.findFirst({
      where: {
        id: validandoCampos.id_archivo,
        departamento: {
          miembros: {
            some: {
              id: validaciones.id_usuario,
            },
          },
        },
      },
    });

    // 6. Si el archivo no existe, se retorna un error.
    if (!archivoActual) {
      return retornarRespuestaFunciones(
        "error",
        "El archivo no existe, está eliminado o no tienes permiso para editarlo",
        { id_usuario: validaciones.id_usuario },
        403,
      );
    }

    // 7. Verificar si ya existe otro archivo con el mismo nombre
    const existente = await prisma.archivo.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_carpeta: archivoActual.id_carpeta,
        id: {
          not: validandoCampos.id_archivo,
        },
      },
    });

    // 8. Si se encuentra un archivo con el mismo nombre, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error nombre de archivo en uso",
        { id_usuario: validaciones.id_usuario },
        409,
      );
    }

    // 10. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validaciones correctas", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_archivo: validandoCampos.id_archivo,
      id_carpeta: archivoActual.id_carpeta,
    });
  } catch (error) {
    console.log(`Error interno al editar archivo: `, error);

    return retornarRespuestaFunciones(
      "error",
      "Error interno al editar archivo",
    );
  }
}
