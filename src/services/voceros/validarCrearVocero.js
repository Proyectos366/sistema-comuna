import prisma from "@/libs/prisma";
import AuthTokens from "@/libs/AuthTokens";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import { calcularFechaNacimientoPorEdad } from "@/utils/Fechas";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearVocero(
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
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validandoCampos = ValidarCampos.validarCamposRegistroVocero(
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

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    let tokenVocero;
    let tokenEnUsoEnDB;

    do {
      tokenVocero = AuthTokens.tokenValidarUsuario(10);
      tokenEnUsoEnDB = await prisma.vocero.findFirst({
        where: { token: tokenVocero },
      });
    } while (tokenEnUsoEnDB);

    const voceroExistente = await prisma.vocero.findFirst({
      where: { cedula: validandoCampos.cedula },
    });

    if (voceroExistente) {
      return retornarRespuestaFunciones("error", "Error, vocero ya existe...", {
        id_usuario: validaciones.id_usuario,
      });
    }

    const fechaNacimiento = calcularFechaNacimientoPorEdad(
      validandoCampos.edad
    );

    if (!fechaNacimiento) {
      return retornarRespuestaFunciones(
        "error",
        "Error, edad o fecha de nacimiento incorrecta...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

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
      token: tokenVocero,
      laboral: validandoCampos.laboral,
      fechaNacimiento: fechaNacimiento,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
      id_circuito: validandoCampos.id_circuito,
      id_consejo: validandoCampos.id_consejo,
    });
  } catch (error) {
    console.log("Error interno validar crear vocero: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear vocero..."
    );
  }
}


/**
 * @fileoverview Función utilitaria para validar la identidad del usuario, los campos requeridos
 * y la unicidad del vocero antes de permitir su registro en el sistema.
 * @module services/voceros/validarCrearVocero
 */

import prisma from "@/libs/prisma"; // Cliente Prisma para interactuar con la base de datos
import AuthTokens from "@/libs/AuthTokens"; // Utilidad para generar tokens únicos
import ValidarCampos from "../ValidarCampos"; // Utilidad para validar campos individuales
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para generar respuestas estandarizadas
import { calcularFechaNacimientoPorEdad } from "@/utils/Fechas"; // Función para calcular fecha de nacimiento a partir de la edad
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo mediante token

/**
 * Valida los datos del usuario activo, los campos del vocero y la unicidad del registro
 * antes de permitir su creación.
 * @async
 * @function validarCrearVocero
 * @param {string} nombre - Primer nombre del vocero.
 * @param {string} nombre_dos - Segundo nombre del vocero.
 * @param {string} apellido - Primer apellido del vocero.
 * @param {string} apellido_dos - Segundo apellido del vocero.
 * @param {string|number} cedula - Cédula del vocero.
 * @param {string} correo - Correo electrónico del vocero.
 * @param {string} genero - Género del vocero.
 * @param {number} edad - Edad del vocero.
 * @param {string} telefono - Teléfono de contacto.
 * @param {string} direccion - Dirección de residencia.
 * @param {string} laboral - Condición laboral.
 * @param {number} id_parroquia - ID de la parroquia asociada.
 * @param {number} id_comuna - ID de la comuna asociada.
 * @param {number} id_consejo - ID del consejo comunal asociado.
 * @param {number} id_circuito - ID del circuito asociado.
 * @returns {Promise<Object>} Respuesta estructurada con el resultado de la validación.
 */
export default async function validarCrearVocero(
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
    const validandoCampos = ValidarCampos.validarCamposRegistroVocero(
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

    // 5. Generar un token único para el vocero, asegurando que no esté en uso.
    let tokenVocero;
    let tokenEnUsoEnDB;

    do {
      tokenVocero = AuthTokens.tokenValidarUsuario(10);
      tokenEnUsoEnDB = await prisma.vocero.findFirst({
        where: { token: tokenVocero },
      });
    } while (tokenEnUsoEnDB);

    // 6. Verificar si ya existe un vocero con la misma cédula.
    const voceroExistente = await prisma.vocero.findFirst({
      where: { cedula: validandoCampos.cedula },
    });

    // 7. Si el vocero ya existe, retornar error.
    if (voceroExistente) {
      return retornarRespuestaFunciones("error", "Error, vocero ya existe...", {
        id_usuario: validaciones.id_usuario,
      });
    }

    // 8. Calcular la fecha de nacimiento a partir de la edad.
    const fechaNacimiento = calcularFechaNacimientoPorEdad(
      validandoCampos.edad
    );

    // 9. Si la fecha no se puede calcular, retornar error.
    if (!fechaNacimiento) {
      return retornarRespuestaFunciones(
        "error",
        "Error, edad o fecha de nacimiento incorrecta...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    // 10. Si todas las validaciones son correctas, retornar los datos consolidados.
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
      token: tokenVocero,
      laboral: validandoCampos.laboral,
      fechaNacimiento: fechaNacimiento,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
      id_circuito: validandoCampos.id_circuito,
      id_consejo: validandoCampos.id_consejo,
    });
  } catch (error) {
    // 11. Manejo de errores inesperados.
    console.log("Error interno validar crear vocero: " + error);

    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear vocero..."
    );
  }
}
