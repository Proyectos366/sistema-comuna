import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarConsultarTodasNovedadesDepartamento() {
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
        MiembrosDepartamentos: {
          select: { id: true, nombre: true },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      id_departamento: datosUsuario.MiembrosDepartamentos?.[0]?.id,
      correo: correo,
    });
  } catch (error) {
    console.log(
      `Error, interno validar consultar novedad departamento: ` + error
    );
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar consultar novedad departamento"
    );
  }
}
