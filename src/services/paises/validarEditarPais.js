import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarPais(
  nombre,
  capital,
  descripcion,
  id_pais
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

    const correo = descifrarToken.correo;

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: {
        id: true,
      },
    });

    if (descifrarToken.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permiso",
        { id_usuario: datosUsuario.id }
      );
    }

    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposEditarPais(
      nombre,
      capital,
      descripcion,
      id_pais
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

    const existente = await prisma.pais.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_pais, // excluye el pais que estás editando
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones("error", "Error, el pais ya existe", {
        id_usuario: datosUsuario.id,
      });
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      capital: validandoCampos.capital,
      descripcion: validandoCampos.descripcion,
      id_usuario: datosUsuario.id,
      id_pais: validandoCampos.id_pais,
    });
  } catch (error) {
    console.log(`Error, interno al editar pais: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar pais..."
    );
  }
}
