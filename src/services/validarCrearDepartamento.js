import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "./ValidarCampos";

export default async function validarCrearDepartamento(nombre, descripcion) {
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

    const validarNombre = ValidarCampos.validarCamposCrearDepartamento(
      nombre,
      descripcion
    );

    if (validarNombre.status === "error") {
      return retornarRespuestaFunciones(
        validarNombre.status,
        validarNombre.message
      );
    }

    const nombreMinuscula = nombre.toLowerCase();
    const descripcionMinuscula = descripcion
      ? descripcion.toLowerCase()
      : "sin descripción";

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!idUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario no existe...");
    }

    const usuario_id = Number(idUsuario.id);

    if (typeof usuario_id !== "number") {
      return retornarRespuestaFunciones(
        "error",
        "Error, id_usuario no es un numero"
      );
    }

    const nombreRepetido = await prisma.departamento.findFirst({
      where: {
        nombre: nombreMinuscula,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, departamento ya existe..."
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: usuario_id,
      nombre: nombreMinuscula,
      descripcion: descripcionMinuscula,
    });
  } catch (error) {
    console.log(`Error, interno al crear departamento: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear departamento"
    );
  }
}
