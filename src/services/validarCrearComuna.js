import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "./ValidarCampos";

export default async function validarCrearComuna(
  nombre,
  direccion,
  norte,
  sur,
  este,
  oeste,
  punto,
  rif,
  codigo,
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

    const validarNombre = ValidarCampos.validarCampoNombre(nombre);

    if (validarNombre.status === "error") {
      return retornarRespuestaFunciones(
        validarNombre.status,
        validarNombre.message
      );
    }

    const correo = descifrarToken.correo;
    const nombreMinuscula = nombre.toLowerCase();
    const direccionMinuscula = direccion ? direccion.toLowerCase() : "";
    const norteMinuscula = norte ? norte.toLowerCase() : "";
    const surMinuscula = sur ? sur.toLowerCase() : "";
    const esteMinuscula = este ? este.toLowerCase() : "";
    const oesteMinuscula = oeste ? oeste.toLowerCase() : "";
    const puntoMinuscula = punto ? punto.toLowerCase() : "";
    const rifMinuscula = rif ? rif.toLowerCase() : "";

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!idUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario no existe...");
    }

    const usuario_id = Number(idUsuario.id);
    const parroquia_id = Number(id_parroquia);

    if (typeof usuario_id !== "number") {
      return retornarRespuestaFunciones(
        "error",
        "Error, id_usuario no es un numero"
      );
    }

    if (typeof parroquia_id != "number") {
      return retornarRespuestaFunciones(
        "error",
        "Error, id_parroquia no es un numero..."
      );
    }

    const nombreRepetido = await prisma.comuna.findFirst({
      where: {
        nombre: nombreMinuscula,
        id_parroquia: parroquia_id,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, comuna ya existe...");
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: usuario_id,
      id_parroquia: parroquia_id,
      nombre: nombreMinuscula,
      direccion: direccionMinuscula,
      norte: norteMinuscula,
      sur: surMinuscula,
      este: esteMinuscula,
      oeste: oesteMinuscula,
      punto: puntoMinuscula,
      rif: rifMinuscula,
      codigo: codigo,
    });
  } catch (error) {
    console.log(`Error, interno al crear comuna: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear comuna"
    );
  }
}
