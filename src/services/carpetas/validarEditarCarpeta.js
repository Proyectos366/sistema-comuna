/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de edición de una carpeta en la base de datos. @module services/carpetas/validarEditarCarpeta
*/

import prisma from "@/libs/prisma";
import ValidarCampos from "@/services/ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken";

export default async function validarEditarCarpeta(
  nombre,
  descripcion,
  nivel,
  seccion,
  id_carpeta,
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
    const validandoCampos = ValidarCampos.validarCamposEditarCarpeta(
      nombre,
      descripcion,
      nivel,
      seccion,
      id_carpeta,
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

    // 5. Verificar que la carpeta existe y el usuario pertenece al departamento
    const carpetaActual = await prisma.carpeta.findFirst({
      where: {
        id: validandoCampos.id_carpeta,
        borrado: false, // Solo carpetas activas
        estantes: {
          borrado: false, // Solo estantes activos
        },
        departamentos: {
          miembros: {
            some: {
              id: validaciones.id_usuario,
            },
          },
        },
      },
      include: {
        estantes: true,
      },
    });

    if (!carpetaActual) {
      return retornarRespuestaFunciones(
        "error",
        "La carpeta no existe, está eliminada o no tienes permiso para editarla",
        { id_usuario: validaciones.id_usuario },
        403,
      );
    }

    // 6. Validar nivel (0 a límite del estante)
    if (
      validandoCampos.nivel < 0 ||
      validandoCampos.nivel > carpetaActual.estantes.nivel
    ) {
      return retornarRespuestaFunciones(
        "error",
        validandoCampos.nivel < 0
          ? "El nivel no puede ser negativo"
          : `El nivel no puede ser mayor a ${carpetaActual.estantes.nivel}`,
        { id_usuario: validaciones.id_usuario },
        400,
      );
    }

    // 7. Validar sección (1 a límite del estante)
    if (
      validandoCampos.seccion < 1 ||
      validandoCampos.seccion > carpetaActual.estantes.seccion
    ) {
      return retornarRespuestaFunciones(
        "error",
        validandoCampos.seccion < 1
          ? "La sección debe ser mayor o igual a 1"
          : `La sección no puede ser mayor a ${carpetaActual.estantes.seccion}`,
        { id_usuario: validaciones.id_usuario },
        400,
      );
    }

    // 8. Verificar si ya existe otra carpeta con el mismo nombre
    const existente = await prisma.carpeta.findFirst({
      where: {
        nivel: validandoCampos.nivel,
        seccion: validandoCampos.seccion,
        nombre: validandoCampos.nombre,
        id_estante: carpetaActual.id_estante,
        id: {
          not: validandoCampos.id_carpeta,
        },
        borrado: false,
      },
    });

    // 9. Si se encuentra una carpeta con el mismo nombre, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error nombre de carpeta en uso",
        { id_usuario: validaciones.id_usuario },
        409,
      );
    }

    // 10. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validaciones correctas", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      nivel: validandoCampos.nivel,
      seccion: validandoCampos.seccion,
      id_carpeta: validandoCampos.id_carpeta,
      id_estante: carpetaActual.id_estante,
    });
  } catch (error) {
    console.log(`Error interno al editar carpeta: `, error);

    return retornarRespuestaFunciones(
      "error",
      "Error interno al editar carpeta",
    );
  }
}
