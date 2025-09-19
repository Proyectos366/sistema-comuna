/**
 @fileoverview Función utilitaria para validar la identidad del usuario antes de consultar
 todas las novedades asociadas a su departamento dentro del rango semanal actual.
 @module services/novedades/validarConsultarTodasNovedadesDepartamento
*/

import { startOfWeek, endOfWeek } from "date-fns"; // Utilidades para calcular el rango semanal
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida la identidad del usuario y prepara los datos necesarios para consultar las novedades
 de su departamento en la semana actual (lunes a domingo).
 @async
 @function validarConsultarTodasNovedadesDepartamento
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/
export default async function validarConsultarTodasNovedadesDepartamento() {
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

    // 3. Calcular el inicio y fin de la semana actual (lunes a domingo).
    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lunes
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 }); // Domingo

    // 4. Si todas las validaciones son correctas, se consolidan y retornan los datos validados.
    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_departamento: validaciones.id_departamento,
      id_institucion: validaciones.id_institucion ?? null,
      correo: validaciones.correo,
      inicioSemana: inicioSemana,
      finSemana: finSemana,
    });
  } catch (err) {
    // 5. Manejo de errores inesperados.
    console.log("Error interno validar consultar novedad departamento: " + err);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar novedad departamento"
    );
  }
}
