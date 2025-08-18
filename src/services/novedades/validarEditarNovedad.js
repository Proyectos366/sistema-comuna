import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarNovedad(
  nombre,
  descripcion,
  id_novedad
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

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correoUsuarioActivo },
      select: {
        id: true,
      },
    });

    // Validar campos
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
          id_usuario: datosUsuario.id,
        }
      );
    }

    const existente = await prisma.novedad.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_novedad, // excluye la novedad que estás editando
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la novedad ya existe",
        { id_usuario: datosUsuario.id },
        400
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_usuario: datosUsuario.id,
      id_novedad: validandoCampos.id_novedad,
    });
  } catch (error) {
    console.log(`Error, interno al editar novedad: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar novedad..."
    );
  }
}
