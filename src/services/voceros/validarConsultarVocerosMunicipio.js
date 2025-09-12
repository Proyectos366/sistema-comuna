import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarConsultarVocerosMunicipio() {
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
        MiembrosInstitucion: {
          select: { id_municipio: true },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    let idParroquias;
    if (descifrarToken.id_rol !== 1) {
      const parroquias = await prisma.parroquia.findMany({
        where: {
          id_municipio: datosUsuario.MiembrosInstitucion[0].id_municipio,
        },
        select: {
          id: true,
        },
      });

      idParroquias = parroquias.map((p) => p.id);
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      correo: correo,
      id_parroquias: idParroquias,
      id_rol: descifrarToken.id_rol,
    });
  } catch (error) {
    console.log(`Error, interno validar consultar voceros municipio: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar consultar voceros municipio"
    );
  }
}
