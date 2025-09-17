import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCambiarRol(idRol, idUsuario) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    if (descifrarToken.id_rol !== 1 && descifrarToken.id_rol !== 2) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    const correo = descifrarToken.correo;

    const validarIdRol = ValidarCampos.validarCampoId(idRol);
    const validarIdUsuario = ValidarCampos.validarCampoId(idUsuario);

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

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
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
      id_usuario: datosUsuario.id,
      id_rol: validarIdRol.id,
      id_usuario_rol: validarIdUsuario.id,
    });
  } catch (error) {
    console.log(`Error interno validar cambiar rol: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar cambiar rol"
    );
  }
}
