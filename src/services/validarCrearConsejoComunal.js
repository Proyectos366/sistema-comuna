import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarCrearConsejoComunal(
  nombre,
  direccion,
  norte,
  sur,
  este,
  oeste,
  punto,
  rif,
  codigo,
  id_parroquia,
  id_comuna,
  id_circuito
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
    const nombreMayuscula = nombre.toUpperCase();
    const direccionMayuscula = direccion ? direccion.toUpperCase() : "";
    const norteMayuscula = norte ? norte.toUpperCase() : "";
    const surMayuscula = sur ? sur.toUpperCase() : "";
    const esteMayuscula = este ? este.toUpperCase() : "";
    const oesteMayuscula = oeste ? oeste.toUpperCase() : "";
    const puntoMayuscula = punto ? punto.toUpperCase() : "";
    const rifMayuscula = rif ? rif.toUpperCase() : "";

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    const usuario_id = Number(idUsuario.id);
    const parroquia_id = Number(id_parroquia);
    const comuna_id = id_comuna ? Number(id_comuna) : null;
    const circuito_id = id_circuito ? Number(id_circuito) : null;

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

    if (typeof comuna_id != "number") {
      return retornarRespuestaFunciones(
        "error",
        "Error, id_comuna no es un numero..."
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: usuario_id,
      id_parroquia: parroquia_id,
      id_comuna: comuna_id,
      id_circuito: circuito_id,
      nombre: nombreMayuscula,
      direccion: direccionMayuscula,
      norte: norteMayuscula,
      sur: surMayuscula,
      este: esteMayuscula,
      oeste: oesteMayuscula,
      punto: puntoMayuscula,
      rif: rifMayuscula,
      codigo: codigo,
    });
  } catch (error) {
    console.log(`Error, interno al crear circuito: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear circuito"
    );
  }
}
