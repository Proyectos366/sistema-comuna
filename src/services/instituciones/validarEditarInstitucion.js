import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarEditarInstitucion(
  nombre,
  descripcion,
  rif,
  sector,
  direccion,
  id_pais,
  id_estado,
  id_municipio,
  id_institucion
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
    const validandoCampos = ValidarCampos.validarCamposEditarInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_institucion
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

    const existente = await prisma.institucion.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id: {
          not: validandoCampos.id_institucion, // excluye la institucion que estás editando
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la institucion ya existe",
        { id_usuario: datosUsuario.id },
        400
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      rif: validandoCampos.rif,
      sector: validandoCampos.sector,
      direccion: validandoCampos.direccion,
      id_usuario: datosUsuario.id,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
      id_municipio: validandoCampos.id_municipio,
      id_institucion: validandoCampos.id_institucion,
    });
  } catch (error) {
    console.log(`Error, interno al editar institucion: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar institucion..."
    );
  }
}
