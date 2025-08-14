import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarEstado(
  nombre,
  capital,
  codigoPostal,
  descripcion,
  id_pais,
  id_estado
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
    const validandoCampos = ValidarCampos.validarCamposEditarEstado(
      nombre,
      capital,
      codigoPostal,
      descripcion,
      id_pais,
      id_estado
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

    const existente = await prisma.estado.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_pais: validandoCampos.id_pais,
        id: {
          not: validandoCampos.id_estado, // excluye el pais que estás editando
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones("error", "Error, el estado ya existe", {
        id_usuario: datosUsuario.id,
      });
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      capital: validandoCampos.capital,
      codigoPostal: validandoCampos.codigoPostal,
      descripcion: validandoCampos.descripcion,
      id_usuario: datosUsuario.id,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
    });
  } catch (error) {
    console.log(`Error, interno al editar estado: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar estado..."
    );
  }
}
