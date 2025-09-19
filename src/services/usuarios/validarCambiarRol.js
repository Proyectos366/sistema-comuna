import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCambiarRol(idRol, idUsuario) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    if (validaciones.id_rol !== 1 && validaciones.id_rol !== 2) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    const correo = validaciones.correo;

    const validarIdRol = ValidarCampos.validarCampoId(idRol, "rol");
    const validarIdUsuario = ValidarCampos.validarCampoId(idUsuario, "usuario");

    if (validarIdRol.status === "error") {
      return retornarRespuestaFunciones(
        validarIdRol.status,
        validarIdRol.message
      );
    }

    if (validarIdUsuario.status === "error") {
      return retornarRespuestaFunciones(
        validarIdUsuario.status,
        validarIdUsuario.message
      );
    }

    const yaTieneRol = await prisma.usuario.findFirst({
      where: {
        id: validarIdUsuario.id,
        id_rol: validarIdRol.id,
        borrado: false,
      },
      select: { id: true },
    });

    if (yaTieneRol) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el usuario ya tiene este rol... "
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_rol: validarIdRol.id,
      id_usuario_rol: validarIdUsuario.id,
    });
  } catch (error) {
    console.log("Error interno validar cambiar rol: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar cambiar rol"
    );
  }
}
