import prisma from "@/libs/prisma";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarEditarPais(
  nombre,
  capital,
  descripcion,
  id_pais
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
        "Error, usuario no tiene permiso",
        { id_usuario: validaciones.id_usuario }
      );
    }

    const validandoCampos = ValidarCampos.validarCamposEditarPais(
      nombre,
      capital,
      descripcion,
      id_pais
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

    const existente = await prisma.pais.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_pais,
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones("error", "Error, el pais ya existe", {
        id_usuario: validaciones.id_usuario,
      });
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      capital: validandoCampos.capital,
      descripcion: validandoCampos.descripcion,
      id_pais: validandoCampos.id_pais,
    });
  } catch (error) {
    console.log("Error interno validar editar pais: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar pais..."
    );
  }
}
