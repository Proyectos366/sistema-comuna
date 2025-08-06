import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";

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
  id_circuito,
  comunaCircuito
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

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    if (!idUsuario) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no encontrado"
      );
    }

    const usuarioId = idUsuario.id;
    const validandoCampos = ValidarCampos.validarCamposCrearConsejoComunal(
      nombre,
      usuarioId,
      id_parroquia,
      id_comuna,
      id_circuito,
      comunaCircuito
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const direccionMinuscula = direccion ? direccion.toLowerCase() : "";
    const norteMinuscula = norte ? norte.toLowerCase() : "";
    const surMinuscula = sur ? sur.toLowerCase() : "";
    const esteMinuscula = este ? este.toLowerCase() : "";
    const oesteMinuscula = oeste ? oeste.toLowerCase() : "";
    const puntoMinuscula = punto ? punto.toLowerCase() : "";
    const rifMinuscula = rif ? rif.toLowerCase() : "";

    const whereClause = {
      nombre: validandoCampos.nombre,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
      id_circuito: validandoCampos.id_circuito,
    };

    const consejoExistente = await prisma.consejo.findFirst({
      where: whereClause,
    });

    if (consejoExistente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, consejo comunal ya existe...."
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validandoCampos.id_usuario,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
      id_circuito: validandoCampos.id_circuito,
      nombre: validandoCampos.nombre,
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
    console.log(`Error, interno al crear consejo: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear consejo"
    );
  }
}
