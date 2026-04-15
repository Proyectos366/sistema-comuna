/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de edición de estante en la base de datos. @module services/estantes/validarEditarEstante
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "@/services/ValidarCampos"; // Clase para validar campos de entrada
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "@/services/obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo

/**
 Valida los campos y la lógica de negocio para editar un estante.
 @async
 @function validarEditarEstante
 @param {string} nombre - El nuevo nombre del estante.
 @param {string} descripcion - La nueva descripción del estante.
 @param {string} niveles - Los nuevos niveles del estante.
 @param {string} secciones - Las nuevas secciones del estante.
 @param {number} id_estante - El ID del estante a editar.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarEditarEstante(
  nombre,
  descripcion,
  niveles,
  secciones,
  id_estante,
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

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validandoCampos = ValidarCampos.validarCamposEditarEstante(
      nombre,
      descripcion,
      niveles,
      secciones,
      id_estante,
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

    // 5. Verificar si ya existe otro estante con el mismo nombre.
    const existente = await prisma.estante.findFirst({
      where: {
        id_institucion: validaciones.id_institucion,
        id_departamento: validaciones.id_departamento,
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_estante, // excluye el estante que estás editando
        },
      },
    });

    // 6. Si se encuentra un estante con el mismo nombre, se retorna un error.
    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error nombre de estante usado",
        { id_usuario: validaciones.id_usuario },
        409,
      );
    }

    // 7. Verificar si el estante tiene carpetas en niveles o secciones que excederían los nuevos límites
    const estanteActual = await prisma.estante.findUnique({
      where: { id: validandoCampos.id_estante },
      include: {
        carpetas: {
          where: {
            OR: [
              { nivel: { gt: validandoCampos.nivel } },
              { seccion: { gt: validandoCampos.seccion } },
            ],
          },
        },
      },
    });

    // 8. Si tiene carpetas en niveles/secciones mayores a los nuevos, no permitir editar
    if (estanteActual.carpetas.length > 0) {
      return retornarRespuestaFunciones(
        "error",
        "Error, no se puede actualizar el estante",
        { id_usuario: validaciones.id_usuario },
        409,
      );
    }

    // 9. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validaciones correctas", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      niveles: validandoCampos.niveles,
      secciones: validandoCampos.secciones,
      id_estante: validandoCampos.id_estante,
    });
  } catch (error) {
    // 10. Manejo de errores inesperados.
    console.log(`Error interno validar editar estante: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar estante",
    );
  }
}
