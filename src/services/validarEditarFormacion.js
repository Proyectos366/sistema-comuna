import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "@/services/ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarFormacion(
  nombre,
  cantidadModulos,
  descripcion,
  id_formacion
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

    const correoUsuarioActivo = descifrarToken.correo;

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correoUsuarioActivo },
      select: {
        id: true,
      },
    });

    if (!idUsuario) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario invalido...",
        {},
        400
      );
    }

    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposEditarFormacion(
      nombre,
      cantidadModulos,
      descripcion,
      id_formacion
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: idUsuario.id,
        }
      );
    }

    const existente = await prisma.formacion.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_formacion, // excluye el cargo que estás editando
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la formación ya existe",
        { id_usuario: idUsuario.id },
        400
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      cantidadModulos: validandoCampos.cantidadModulos,
      descripcion: validandoCampos.descripcion,
      id_usuario: idUsuario.id,
      id_formacion: validandoCampos.id_formacion,
    });
  } catch (error) {
    console.log(`Error, interno al editar formación: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar formación..."
    );
  }
}
