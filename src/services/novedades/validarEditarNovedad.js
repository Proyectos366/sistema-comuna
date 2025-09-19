import prisma from "@/libs/prisma";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarEditarNovedad(
  nombre,
  descripcion,
  id_novedad
) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validandoCampos = ValidarCampos.validarCamposEditarNovedad(
      nombre,
      descripcion,
      id_novedad
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

    const existente = await prisma.novedad.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_novedad,
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la novedad ya existe",
        { id_usuario: validaciones.id_usuario },
        400
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_novedad: validandoCampos.id_novedad,
    });
  } catch (error) {
    console.log("Error interno validar editar novedad: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar novedad..."
    );
  }
}
