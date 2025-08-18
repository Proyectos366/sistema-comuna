import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";

export default async function validarCrearNovedad(
  nombre,
  descripcion,
  id_institucion,
  id_departamento,
  rango
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

    const validarCampos = ValidarCampos.validarCamposCrearNovedad(
      nombre,
      descripcion,
      id_institucion,
      id_departamento,
      rango
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    const correo = descifrarToken.correo;

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: {
        id: true,
        id_rol: true,
        MiembrosInstitucion: {
          select: { id: true },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      rango: validarCampos.rango,
      tipo: descifrarToken.id_rol === 1 ? "institucional" : "departamental",
      id_institucion:
        validarCampos.rango === 1
          ? validarCampos.id_institucion
          : datosUsuario.MiembrosInstitucion?.[0]?.id,
      id_departamento:
        validarCampos.rango === 1 ? null : validarCampos.id_departamento,
    });
  } catch (error) {
    console.log(`Error, interno al crear novedad: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear novedad"
    );
  }
}
