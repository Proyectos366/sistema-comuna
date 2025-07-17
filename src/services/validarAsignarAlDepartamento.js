import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "./ValidarCampos";

export default async function validarAsignarAlDepartamento(
  idDepartamento,
  idUsuario
) {
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

    const validarIdDepartamento = ValidarCampos.validarCampoId(idDepartamento);
    const validarIdUsuario = ValidarCampos.validarCampoId(idUsuario);

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

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
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
      return generarRespuesta(
        "error",
        "Error, el usuario ya esta en este departamento... ",
        {},
        409
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      id_departamento: validarIdDepartamento.id,
      id_usuario_miembro: validarIdUsuario.id,
    });
  } catch (error) {
    console.log(`Error, interno asignar al departamento: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno asignar al departamento"
    );
  }
}
