/**
 @fileoverview Función utilitaria para validar la identidad del usuario, los campos requeridos
 y la existencia del vocero antes de permitir su edición.
 @module services/voceros/validarEditarVocero
*/

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import { calcularFechaNacimientoPorEdad } from "@/utils/Fechas"; // Función para calcular fecha de nacimiento a partir de la edad
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

/**
 Valida los datos del usuario activo, los campos del vocero y la existencia del registro
 antes de permitir su edición.
 @async
 @function validarEditarVocero
 @param {string} nombre - Primer nombre del vocero.
 @param {string} nombre_dos - Segundo nombre del vocero.
 @param {string} apellido - Primer apellido del vocero.
 @param {string} apellido_dos - Segundo apellido del vocero.
 @param {string|number} cedula - Cédula del vocero.
 @param {string} correo - Correo electrónico del vocero.
 @param {string} genero - Género del vocero.
 @param {number} edad - Edad del vocero.
 @param {string} telefono - Teléfono de contacto.
 @param {string} direccion - Dirección de residencia.
 @param {string} laboral - Condición laboral.
 @param {number} id_parroquia - ID de la parroquia asociada.
 @param {number} id_comuna - ID de la comuna asociada.
 @param {number} id_consejo - ID del consejo comunal asociado.
 @param {number} id_circuito - ID del circuito asociado.
 @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
*/

export default async function validarEditarVocero(
  nombre,
  nombre_dos,
  apellido,
  apellido_dos,
  cedula,
  correo,
  genero,
  edad,
  telefono,
  direccion,
  laboral,
  id_parroquia,
  id_comuna,
  id_consejo,
  id_circuito
) {
  try {
    // 1. Validar identidad del usuario activo mediante el token.
    const validaciones = await obtenerDatosUsuarioToken();

    // 2. Si el token es inválido, retornar error.
    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // 3. Validar los campos del vocero.
    const validandoCampos = ValidarCampos.validarCamposEditarVocero(
      nombre,
      nombre_dos,
      apellido,
      apellido_dos,
      cedula,
      correo,
      genero,
      edad,
      telefono,
      direccion,
      laboral,
      id_parroquia,
      id_comuna,
      id_consejo,
      id_circuito
    );

    // 4. Si los campos son inválidos, retornar error.
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 5. Calcular la fecha de nacimiento a partir de la edad.
    const fechaNacimiento = calcularFechaNacimientoPorEdad(
      validandoCampos.edad
    );

    // 6. Verificar si el vocero existe en la base de datos.
    const existente = await prisma.vocero.findUnique({
      where: { cedula: validandoCampos.cedula },
    });

    // 7. Si el vocero no existe, retornar error.
    if (!existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error el vocero no existe",
        { id_usuario: validaciones.id_usuario },
        404
      );
    }

    // 8. Si todas las validaciones son correctas, retornar los datos consolidados.
    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      nombreDos: validandoCampos.nombre_dos,
      apellido: validandoCampos.apellido,
      apellidoDos: validandoCampos.apellido_dos,
      cedula: validandoCampos.cedula,
      genero: validandoCampos.genero,
      edad: validandoCampos.edad,
      telefono: validandoCampos.telefono,
      direccion: validandoCampos.direccion,
      correo: validandoCampos.correo,
      laboral: validandoCampos.laboral,
      fechaNacimiento: fechaNacimiento,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
      id_circuito: validandoCampos.id_circuito,
      id_consejo: validandoCampos.id_consejo,
    });
  } catch (error) {
    // 9. Manejo de errores inesperados.
    console.log("Error interno validar editar vocero: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar vocero..."
    );
  }
}
