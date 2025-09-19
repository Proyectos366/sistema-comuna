/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los parámetros
 necesarios antes de crear un nuevo municipio dentro de un estado.
 @module services/municipios/validarCrearMunicipio
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y los datos requeridos para crear un nuevo municipio.
 Verifica que el nombre no esté duplicado dentro del estado y genera un serial único.
 @async
 @function validarCrearMunicipio
 @param {string} nombre - Nombre del municipio.
 @param {string} descripcion - Descripción del municipio.
 @param {string|number} id_pais - Identificador del país.
 @param {string|number} id_estado - Identificador del estado.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearMunicipio(
  nombre,
  descripcion,
  id_pais,
  id_estado
) {
  try {
    // 1. Obtener y validar los datos del usuario a través del token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, se retorna un error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Verificar si el usuario tiene permisos de master (rol 1).
    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 4. Validar los campos del municipio.
    const validarCampos = ValidarCampos.validarCamposCrearMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado
    );

    // 5. Si los campos son inválidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
        { id_usuario: validaciones.id_usuario }
      );
    }

    // 6. Obtener los datos del estado para generar el serial del municipio.
    const datosEstado = await prisma.estado.findFirst({
      where: { id: validarCampos.id_estado },
      select: { serial: true, municipios: true },
    });

    // 7. Verificar si ya existe un municipio con el mismo nombre en el estado.
    const nombreRepetido = await prisma.municipio.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_estado: validarCampos.id_estado,
      },
    });

    // 8. Si el nombre ya está en uso, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, municipio ya existe...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 9. Generar el serial del municipio basado en la cantidad de estados existentes.
    const cantidadEstados = datosEstado.municipios.length + 1;
    const numeroFormateado =
      cantidadEstados < 10 ? `0${cantidadEstados}` : `${cantidadEstados}`;
    const serialMunicipio = `${datosEstado.serial}-${numeroFormateado}`;

    // 10. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      serial: serialMunicipio,
      id_pais: validarCampos.id_pais,
      id_estado: validarCampos.id_estado,
    });
  } catch (error) {
    // 11. Manejo de errores inesperados.
    console.log("Error interno validar crear municipio: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear municipio"
    );
  }
}
