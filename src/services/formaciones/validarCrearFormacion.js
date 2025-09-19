/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de realizar una operación
 de creación de una formación en la base de datos.
 @module services/formaciones/validarCrear
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Clase para validar campos de entrada
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los campos y la identidad del usuario para la creación de una formación.
 @async
 @function validarCrearFormacion
 @param {string} nombre - El nombre de la nueva formación.
 @param {number} cantidadModulos - La cantidad de módulos que tendrá la formación.
 @param {string} descripcion - La descripción de la formación.
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearFormacion(
  nombre,
  cantidadModulos,
  descripcion
) {
  try {
    // 1. Obtener y validar el correo del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Validar los campos de entrada utilizando la clase ValidarCampos.
    const validandoCampos = ValidarCampos.validarCamposCrearFormacion(
      nombre,
      cantidadModulos,
      descripcion
    );

    // 4. Si los campos no son válidos, se retorna un error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    // 5. Verificar si ya existe una formación con el mismo nombre.
    const nombreRepetido = await prisma.formacion.findFirst({
      where: {
        nombre: validandoCampos.nombre,
      },
    });

    // 6. Si el nombre ya existe, se retorna un error con el ID del usuario.
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, formacion ya existe...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 7. Obtener los módulos disponibles según la cantidad solicitada.
    const todoscantidadModulos = await prisma.modulo.findMany({
      where: { borrado: false },
      select: { id: true },
      take: validandoCampos.cantidadModulos,
      orderBy: {
        id: "asc",
      },
    });

    // 8. Si no hay módulos suficientes, se retorna un error.
    if (!todoscantidadModulos || todoscantidadModulos.length === 0) {
      return retornarRespuestaFunciones(
        "error",
        "Error, no hay cantidad modulos...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 9. Si todas las validaciones son correctas, se consolidan y retornan los datos.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      cantidadModulos: validandoCampos.cantidadModulos,
      todosModulos: todoscantidadModulos,
      descripcion: validandoCampos.descripcion,
      id_institucion: !validaciones.id_institucion
        ? null
        : validaciones.id_institucion,
      id_departamento: !validaciones.id_departamento
        ? null
        : validaciones.id_departamento,
    });
  } catch (error) {
    // 10. Manejo de errores inesperados.
    console.log("Error interno validar crear formacion: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear formacion"
    );
  }
}
