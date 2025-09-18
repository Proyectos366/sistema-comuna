/**
 @fileoverview Función utilitaria para validar la identidad del usuario y los parámetros
 necesarios antes de crear un nuevo estado dentro de un país.
 @module services/estados/validarCrearEstado
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y los datos requeridos para crear un nuevo estado.
 Verifica que el nombre no esté repetido dentro del país y genera un serial único.
 @async
 @function validarCrearEstado
 @param {string} nombre - Nombre del estado.
 @param {string} capital - Capital del estado.
 @param {string|number} codigoPostal - Código postal del estado.
 @param {string} descripcion - Descripción del estado.
 @param {string|number} id_pais - Identificador único del país al que pertenece el estado.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearEstado(
  nombre,
  capital,
  codigoPostal,
  descripcion,
  id_pais
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

    // 3. Validar los campos del estado.
    const validarCampos = ValidarCampos.validarCamposCrearEstado(
      nombre,
      capital,
      codigoPostal,
      descripcion,
      id_pais
    );

    // 4. Si los campos son inválidos, se retorna un error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    // 5. Obtener los datos del país para generar el serial del estado.
    const datosPais = await prisma.pais.findFirst({
      where: { id: validarCampos.id_pais },
      select: { serial: true, estados: true },
    });

    // 6. Verificar si ya existe un estado con el mismo nombre en el país.
    const nombreRepetido = await prisma.estado.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_pais: validarCampos.id_pais,
      },
    });

    // 7. Si el nombre ya está en uso, se retorna un error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, estado ya existe...", {
        id_usuario: validaciones.id_usuario,
      });
    }

    // 8. Generar el serial del estado basado en la cantidad de estados existentes.
    const cantidadEstados = datosPais.estados.length + 1;
    const numeroFormateado =
      cantidadEstados < 10 ? `0${cantidadEstados}` : `${cantidadEstados}`;
    const serialEstado = `${datosPais.serial}-${numeroFormateado}`;

    // 9. Retornar la respuesta con los datos validados y el serial generado.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      capital: validarCampos.capital,
      codigoPostal: validarCampos.codigoPostal,
      descripcion: validarCampos.descripcion,
      serial: serialEstado,
      id_pais: validarCampos.id_pais,
    });
  } catch (error) {
    // 10. Manejo de errores inesperados.
    console.log("Error interno validar crear estado: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear estado"
    );
  }
}
