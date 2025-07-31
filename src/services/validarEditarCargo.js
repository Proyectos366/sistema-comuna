import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "@/services/ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarCargo(
  nombre,
  descripcion,
  id_cargo
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

    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposEditarCargo(
      nombre,
      descripcion,
      id_cargo
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

    const existente = await prisma.cargo.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_cargo, // excluye el cargo que estás editando
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el cargo ya existe",
        { id_usuario: idUsuario.id },
        400
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_usuario: idUsuario.id,
      id_cargo: validandoCampos.id_cargo,
    });
  } catch (error) {
    console.log(`Error, interno al editar cargo: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar cargo..."
    );
  }
}
