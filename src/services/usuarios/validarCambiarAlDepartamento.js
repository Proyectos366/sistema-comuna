import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCambiarAlDepartamento(
  idDepartamento,
  idUsuario
) {
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

    const validarIdDepartamento = ValidarCampos.validarCampoId(
      idDepartamento,
      "departamento"
    );

    const validarIdUsuario = ValidarCampos.validarCampoId(idUsuario, "usuario");

    if (validarIdDepartamento.status === "error") {
      return retornarRespuestaFunciones(
        validarIdDepartamento.status,
        validarIdDepartamento.message
      );
    }

    if (validarIdUsuario.status === "error") {
      return retornarRespuestaFunciones(
        validarIdUsuario.status,
        validarIdUsuario.message
      );
    }

    const yaEsMiembro = await prisma.departamento.findFirst({
      where: {
        id: validarIdDepartamento.id,
        miembros: {
          some: { id: validarIdUsuario.id },
        },
      },
    });

    if (yaEsMiembro) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el usuario ya esta en este departamento... "
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_departamento: validarIdDepartamento.id,
      id_usuario_miembro: validarIdUsuario.id,
    });
  } catch (error) {
    console.log("Error interno validar cambiar departamento: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar cambiar departamento"
    );
  }
}
