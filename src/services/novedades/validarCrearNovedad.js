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
  rango,
  prioridad
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
      rango,
      prioridad
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
        MiembrosDepartamentos: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    let departamentos;

    if (descifrarToken.id_rol === 1) {
      departamentos = await prisma.departamento.findMany({
        where: {
          id_institucion: validarCampos.id_institucion,
        },
        select: {
          id: true,
        },
      });
    }

    const mapaPrioridad = {
      1: "alta",
      2: "media",
      3: "baja",
    };

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      rango: validarCampos.rango,
      prioridad: mapaPrioridad[validarCampos.prioridad],
      departamentos: departamentos ? departamentos : [],
      id_institucion:
        validarCampos.rango === 1
          ? validarCampos.id_institucion
          : datosUsuario.MiembrosInstitucion?.[0]?.id,
      id_departamento:
        validarCampos.rango === 1 ? null : validarCampos.id_departamento,
      id_depa_origen:
        validarCampos.rango === 1
          ? null
          : datosUsuario.MiembrosDepartamentos?.[0]?.id,
    });
  } catch (error) {
    console.log(`Error, interno al crear novedad: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear novedad"
    );
  }
}
