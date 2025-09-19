import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearPais(
  nombre,
  capital,
  descripcion,
  serial
) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    if (validaciones.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    const validarCampos = ValidarCampos.validarCamposCrearPais(
      nombre,
      capital,
      descripcion,
      serial
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    const nombreRepetido = await prisma.pais.findFirst({
      where: {
        nombre: validarCampos.nombre,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, pais ya existe...", {
        id_usuario: validaciones.id_usuario,
      });
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      capital: validarCampos.capital,
      descripcion: validarCampos.descripcion,
      serial: validarCampos.serial,
    });
  } catch (error) {
    console.log("Error interno validar crear pais: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear pais"
    );
  }
}
