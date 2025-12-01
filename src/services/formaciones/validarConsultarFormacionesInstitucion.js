/**
 @fileoverview Función utilitaria para validar los datos necesarios antes de consultar
 todas las formaciones disponibles por institucion en la base de datos, según el rol del usuario.
 @module services/formaciones/validarConsultarTodas
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y construye la condición de búsqueda para consultar formaciones.
 @async
 @function validarConsultarFormacionesInstitucion
 @returns {Promise<Response>} Respuesta estructurada con el resultado de la validación y la condición de búsqueda.
*/
export default async function validarConsultarFormacionesInstitucion() {
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

    // 3. Construir la condición de búsqueda según el rol del usuario.
    let whereCondicion;

    // Rol 1: Acceso general a todas las formaciones no borradas ni culminadas.
    if (validaciones.id_rol === 1) {
      whereCondicion = {
        borrado: false,
        culminada: false,
      };
    }
    // Rol 2: Acceso limitado a formaciones de su institución.
    else if (validaciones.id_rol === 2) {
      whereCondicion = {
        borrado: false,
        culminada: false,
        id_institucion: validaciones.id_institucion,
      };
    }
    // Otros roles: Acceso a formaciones de su institución o departamento.
    else {
      whereCondicion = {
        borrado: false,
        culminada: false,
        OR: [
          { id_institucion: validaciones.id_institucion },
          { id_departamento: validaciones.id_departamento },
        ],
      };
    }

    // 4. Retornar respuesta exitosa con la condición de búsqueda y datos del usuario.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      condicion: whereCondicion,
      id_institucion: validaciones.id_institucion,
      id_departamento: validaciones.id_departamento,
    });
  } catch (error) {
    // 5. Manejo de errores inesperados.
    console.log("Error interno validar consultar todas formaciones: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todas formaciones"
    );
  }
}
