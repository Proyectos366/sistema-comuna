import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarDepartamento(
  nombre,
  descripcion,
  id_departamento
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
    const validandoCampos = ValidarCampos.validarCamposEditarDepartamento(
      nombre,
      descripcion,
      id_departamento
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

    const existente = await prisma.departamento.findUnique({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_departamento, // excluye el departamento que estás editando
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, el departamento ya existe",
        { id_usuario: idUsuario.id },
        400
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_usuario: idUsuario.id,
      id_departamento: validandoCampos.id_departamento,
    });
  } catch (error) {
    console.log(`Error, interno al editar departamento: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar departamento..."
    );
  }
}
