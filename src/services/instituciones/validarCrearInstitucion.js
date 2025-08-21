import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";

export default async function validarCrearInstitucion(
  nombre,
  descripcion,
  rif,
  sector,
  direccion,
  id_pais,
  id_estado,
  id_municipio,
  id_parroquia
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

    const validarCampos = ValidarCampos.validarCamposCrearInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    if (descifrarToken.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    const nombreRepetido = await prisma.institucion.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_pais: validarCampos.id_pais,
        id_estado: validarCampos.id_estado,
        id_municipio: validarCampos.id_municipio,
        id_parroquia: validarCampos.id_parroquia,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, institución ya existe...",
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      rif: validarCampos.rif,
      sector: validarCampos.sector,
      direccion: validarCampos.direccion,
      id_usuario: datosUsuario.id,
      id_pais: validarCampos.id_pais,
      id_estado: validarCampos.id_estado,
      id_municipio: validarCampos.id_municipio,
      id_parroquia: validarCampos.id_parroquia,
    });
  } catch (error) {
    console.log(`Error, interno al crear institución: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear institución"
    );
  }
}
