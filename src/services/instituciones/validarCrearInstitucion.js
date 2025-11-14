/**
 @fileoverview Función utilitaria para validar la identidad del usuario, sus permisos
 y los parámetros necesarios antes de crear una nueva institución en el sistema.
 @module services/instituciones/validarCrearInstitucion
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario, sus permisos y los datos requeridos para crear una nueva institución.
 Verifica que no exista una institución duplicada en la misma ubicación geográfica.
 @async
 @function validarCrearInstitucion
 @param {string} nombre - Nombre de la institución.
 @param {string} descripcion - Descripción de la institución.
 @param {string} rif - Registro de Información Fiscal de la institución.
 @param {string} sector - Sector al que pertenece la institución.
 @param {string} direccion - Dirección física de la institución.
 @param {string|number} id_pais - Identificador del país.
 @param {string|number} id_estado - Identificador del estado.
 @param {string|number} id_municipio - Identificador del municipio.
 @param {string|number} id_parroquia - Identificador de la parroquia.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarCrearInstitucion(
  nombre,
  descripcion,
  rif,
  sector,
  direccion,
  id_pais,
  id_estado,
  id_municipio,
  id_parroquia
) {
  try {
    // 1. Validar identidad del usuario mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Validar los campos de entrada.
    const validarCampos = ValidarCampos.validarCamposCrearInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia
    );

    // 4. Si los campos son inválidos, retornar error.
    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
        { id_usuario: validaciones.id_usuario }
      );
    }

    // 5. Verificar si el usuario tiene permisos de super admin (rol 1).
    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    // 6. Verificar si ya existe una institución con el mismo nombre en la misma ubicación.
    const nombreRepetido = await prisma.institucion.findFirst({
      where: {
        OR: [
          {
            nombre: validarCampos.nombre,
            id_pais: validarCampos.id_pais,
            id_estado: validarCampos.id_estado,
            id_municipio: validarCampos.id_municipio,
            id_parroquia: validarCampos.id_parroquia,
          },
          {
            rif: validarCampos.rif,
          },
        ],
      },
    });

    // 7. Si el nombre esta repetido, retornar error.
    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, institución ya existe...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 8. Retornar respuesta con los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      rif: validarCampos.rif,
      sector: validarCampos.sector,
      direccion: validarCampos.direccion,
      id_pais: validarCampos.id_pais,
      id_estado: validarCampos.id_estado,
      id_municipio: validarCampos.id_municipio,
      id_parroquia: validarCampos.id_parroquia,
    });
  } catch (error) {
    // 8. Manejo de errores inesperados.
    console.log("Error interno validar crear institución: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear institución"
    );
  }
}
