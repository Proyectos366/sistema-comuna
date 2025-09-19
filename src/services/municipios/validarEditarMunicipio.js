import prisma from "@/libs/prisma";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarEditarMunicipio(
  nombre,
  descripcion,
  id_pais,
  id_estado,
  id_municipio
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

    const validandoCampos = ValidarCampos.validarCamposEditarMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio
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

    const existente = await prisma.municipio.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_estado: validandoCampos.id_estado,
        id: {
          not: validandoCampos.id_municipio,
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el municipio ya existe",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id_usuario,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
      id_municipio: validandoCampos.id_municipio,
    });
  } catch (error) {
    console.log("Error interno validar editar municipio: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar editar municipio..."
    );
  }
}
