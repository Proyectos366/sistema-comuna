import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarCrearComuna(
  nombre,
  direccion,
  latitud,
  longitud,
  punto,
  rif,
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

    const correo = descifrarToken.correo;
    const nombreMayuscula = nombre.toUpperCase();
    const direccionMayuscula = direccion ? direccion.toUpperCase() : "";
    const latitudMayuscula = latitud ? latitud.toUpperCase() : "";
    const longitudMayuscula = longitud ? longitud.toUpperCase() : "";
    const puntoMayuscula = punto ? punto.toUpperCase() : "";
    const rifMayuscula = rif ? rif.toUpperCase() : "";

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

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

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: usuario_id,
      id_parroquia: parroquia_id,
      nombre: nombreMayuscula,
      direccion: direccionMayuscula,
      latitud: latitudMayuscula,
      longitud: longitudMayuscula,
      punto: puntoMayuscula,
      rif: rifMayuscula,
    });
  } catch (error) {
    console.log(`Error, interno al crear parroquia: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear parroquia"
    );
  }
}
