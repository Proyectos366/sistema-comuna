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
  pais,
  estado,
  municipio,
  parroquia,
  sector,
  direccion,
  id_municipio
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

    const validarCampos = ValidarCampos.validarCamposCrearInstitucion(
      nombre,
      descripcion,
      rif,
      pais,
      estado,
      municipio,
      parroquia,
      sector,
      direccion,
      id_municipio
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: descifrarToken.correo },
      select: { id: true },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario no existe...");
    }

    if (descifrarToken.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    const nombreRepetido = await prisma.institucion.findFirst({
      where: {
        rif: validarCampos.rif,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, institucion ya existe...",
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      rif: validarCampos.rif,
      pais: validarCampos.pais,
      estado: validarCampos.estado,
      municipio: validarCampos.municipio,
      parroquia: validarCampos.parroquia,
      sector: validarCampos.sector,
      direccion: validarCampos.direccion,
      id_municipio: validarCampos.id_municipio,
      id_usuario: datosUsuario.id,
    });
  } catch (error) {
    console.log(`Error, interno al crear institucion: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear institucion"
    );
  }
}
