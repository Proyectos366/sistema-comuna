import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "./ValidarCampos";

export default async function validarCrearFormacion(nombre, cantidadModulos) {
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

    const validandoCampos = ValidarCampos.validarCamposCrearFormacion(
      nombre,
      cantidadModulos
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const correo = descifrarToken.correo;
    const nombreMinuscula = nombre.toLowerCase();

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo },
      include: {
        MiembrosDepartamentos: true,
      },
    });

    if (!idUsuario) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no encontrado..."
      );
    }

    const todoscantidadModulos = await prisma.modulo.findMany({
      where: { borrado: false },
      select: { id: true },
      take: validandoCampos.cantidadModulos,
      orderBy: {
        id: "asc",
      },
    });

    if (!todoscantidadModulos || todoscantidadModulos.length === 0) {
      return retornarRespuestaFunciones(
        "error",
        "Error, no hay cantidadModulos..."
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: idUsuario.id,
      nombre: nombreMinuscula,
      cantidadModulos: todoscantidadModulos,
      todosModulos: todoscantidadModulos,
      id_departamento: idUsuario?.MiembrosDepartamentos?.[0]?.id
        ? idUsuario?.MiembrosDepartamentos?.[0]?.id
        : null,
    });
  } catch (error) {
    console.log(`Error, interno al validar crear formacion: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al validar crear formacion"
    );
  }
}
