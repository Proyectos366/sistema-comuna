import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";

export default async function validarAsistenciaPorModulo(
  modulo,
  fecha,
  id_asistencia,
  nombreFormador
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
      select: { id: true },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    const idAsistencia = ValidarCampos.validarCampoId(id_asistencia);
    const moduloNumero = ValidarCampos.validarCampoId(modulo);
    const validarNombre = ValidarCampos.validarCampoNombre(nombreFormador);
    const validarFecha = ValidarCampos.validarCampoFechaISO(fecha);

    if (idAsistencia.status === "error") {
      return retornarRespuestaFunciones(
        idAsistencia.status,
        idAsistencia.message,
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    if (moduloNumero.status === "error") {
      return retornarRespuestaFunciones(
        moduloNumero.status,
        moduloNumero.message,
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    if (validarNombre.status === "error") {
      return retornarRespuestaFunciones(
        validarNombre.status,
        validarNombre.message,
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    if (validarFecha.status === "error") {
      return retornarRespuestaFunciones(
        validarFecha.status,
        validarFecha.message,
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      modulo: moduloNumero.id,
      id_asistencia: idAsistencia.id,
      nombreFormador: validarNombre.nombre,
      fecha: validarFecha.fecha,
    });
  } catch (error) {
    console.log(`Error, interno al validar asistencia: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al validar asistencia"
    );
  }
}
