/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de una carpeta en la base de datos.
 @module services/carpetas/validarCrearCarpeta
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para crear una nueva carpeta.
 @async
 @function validarCrearCarpeta
 @param {string} nombre - El nombre de la nueva carpeta.
 @param {string} descripcion - La descripción de la nueva carpeta.
 @param {string} alias - El alias de la nueva carpeta.
 @param {number} nivel - El número de nivel de la nueva carpeta.
 @param {number} seccion - El número de seccion de la nueva carpeta.
 @param {boolean} cabecera - Indica si la carpeta es cabecera o no.
*/

export default async function validarCrearCarpeta(
  idEstante,
  nombre,
  descripcion,
  alias,
  nivel,
  seccion,
  cabecera,
) {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message,
      );
    }

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validarCampos = ValidarCampos.validarCamposCrearCarpeta(
      idEstante,
      nombre,
      descripcion,
      alias,
      nivel,
      seccion,
      cabecera,
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
      );
    }

    // 5. Verificar si el nombre de la carpeta ya existe en la base de datos.
    const nombreRepetido = await prisma.carpeta.findFirst({
      where: {
        id_estante: validarCampos.id_estante,
        nombre: validarCampos.nombre,
      },
    });

    // 6. Si se encuentra una carpeta con el mismo nombre, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error nombre de carpeta repetido",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 409,
        },
      );
    }

    // 7. Verificar si el alias de la carpeta ya existe en la base de datos.
    const aliasRepetido = await prisma.carpeta.findFirst({
      where: {
        id_estante: validarCampos.id_estante,
        alias: validarCampos.alias,
      },
    });

    // 8. Si se encuentra un carpeta con el mismo alias, se retorna un error.
    if (aliasRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error alias de carpeta repetido",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 409,
        },
      );
    }

    // 9. Código del estante
    const codigoEstante = await prisma.estante.findUnique({
      where: {
        id: validarCampos.id_estante,
      },
      select: {
        codigo: true,
      },
    });

    // 10. Crear código de la carpeta
    const cantidadCarpetas = await prisma.carpeta.count({
      where: {
        id_estante: validarCampos.id_estante,
      },
    });
    const numeroCodigo = String(
      cantidadCarpetas ? cantidadCarpetas + 1 : cantidadCarpetas,
    ).padStart(7, "0");
    const codigoNuevo =
      codigoEstante.codigo.toUpperCase() + "-CARP-" + numeroCodigo;

    // 11. Verificar si la carpeta ya existe
    const carpetaExistente = await prisma.carpeta.findFirst({
      where: {
        AND: [
          { codigo: codigoNuevo },
          { nombre: validarCampos.nombre },
          { alias: validarCampos.alias },
        ],
        id_estante: validaciones.id_estante,
      },
    });

    // 12. Si se encuentra una carpeta con el mismo nombre, se retorna un error.
    if (carpetaExistente) {
      return retornarRespuestaFunciones("error", "Error carpeta existente", {
        id_usuario: validaciones.id_usuario,
        codigo: 409,
      });
    }

    // 13. Obtener nombre de estante
    const nombreEstante = await prisma.estante.findFirst({
      where: {
        id_estante: validaciones.id_estante,
      },
      select: {
        nombre: true,
      },
    });

    // 14. Si no se encuentra el nombre del estante, se retorna un error.
    if (!nombreEstante) {
      return retornarRespuestaFunciones(
        "error",
        "Error al obtener nombre del estante",
        {
          id_usuario: validaciones.id_usuario,
          codigo: 404,
        },
      );
    }

    // 15. Si todas las validaciones son correctas, se consolidan y retornan los datos para la creación.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      alias: validarCampos.alias,
      nivel: validarCampos.nivel,
      seccion: validarCampos.seccion,
      cabecera: validarCampos.cabecera,
      codigo: codigoNuevo,
      nombreInstitucion: validaciones.nombreInstitucion,
      nombreDepartamento: validaciones.nombreDepartamento,
      nombreEstante: nombreEstante.nombre,
      id_departamento: validaciones.id_departamento,
      id_estante: validarCampos.id_estante,
    });
  } catch (error) {
    // 16. Manejo de errores inesperados.
    console.log(`Error interno validar crear carpeta: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear carpeta",
    );
  }
}
