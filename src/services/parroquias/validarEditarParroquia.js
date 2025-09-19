import prisma from "@/libs/prisma";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarEditarParroquia(
  nombre,
  descripcion,
  id_pais,
  id_estado,
  id_municipio,
  id_parroquia
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
        { id_usuario: datosUsuario.id }
      );
    }

    const validandoCampos = ValidarCampos.validarCamposEditarParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const existente = await prisma.parroquia.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_municipio: validandoCampos.id_municipio,
        id: {
          not: validandoCampos.id_parroquia,
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la parroquia ya existe",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      id_usuario: validaciones.id,
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
      id_municipio: validandoCampos.id_municipio,
      id_parroquia: validandoCampos.id_parroquia,
    });
  } catch (error) {
    console.log("Error interno validar editar parroquia: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar editar parroquia..."
    );
  }
}
