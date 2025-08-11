import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarConsultarInstitucionMiembroId() {
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

    if (descifrarToken.id_rol !== 1 && descifrarToken.id_rol !== 2) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permisos..."
      );
    }

    const correo = descifrarToken.correo;

    /** 
      const datosUsuario = await prisma.usuario.findFirst({
        where: { correo: correo },
        select: { id: true },
      });
    */

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: {
        id: true,
        MiembrosMunicipios: {
          select: {
            id: true,
          },
        },
        MiembrosInstitucion: {
          select: {
            id: true,
            id_municipio: true,
          },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    const institucionMiembro = await prisma.institucion.findFirst({
      where: {
        id_municipio: datosUsuario.MiembrosMunicipios?.[0]?.id,
        borrado: false,
      },
    });

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      correo: correo,
      id_institucion: datosUsuario.MiembrosInstitucion?.[0]?.id,
      id_municipio: datosUsuario.MiembrosMunicipios?.[0]?.id,
      institucion: institucionMiembro,
    });
  } catch (error) {
    console.log(
      `Error, interno validar consultar institucion miembro: ` + error
    );
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar consultar institucion miembro"
    );
  }
}
