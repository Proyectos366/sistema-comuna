import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerCorreoToken from "@/utils/obtenerCorreoToken";

export default async function obtenerDatosUsuarioToken() {
  try {
    const validaciones = await obtenerCorreoToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: validaciones.correo },
      select: {
        id: true,
        MiembrosInstitucion: {
          select: { id: true, nombre: true, id_municipio: true },
        },
        MiembrosDepartamentos: {
          select: { id: true, nombre: true },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    return retornarRespuestaFunciones("ok", "Datos usuario obtenidos...", {
      datosUsuario: datosUsuario,
      id_usuario: datosUsuario.id,
      correo: validaciones.correo,
      id_rol: validaciones.id_rol,
      MiembrosInstitucion: datosUsuario.MiembrosInstitucion[0],
      id_municipio: datosUsuario?.MiembrosInstitucion?.[0]?.id_municipio,
      id_institucion: datosUsuario?.MiembrosInstitucion?.[0]?.id,
    });
  } catch (error) {
    console.log(`Error, interno obtener datos usuario: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno obtener datos usuario..."
    );
  }
}
