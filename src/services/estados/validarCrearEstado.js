import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";

export default async function validarCrearEstado(
  nombre,
  capital,
  codigoPostal,
  descripcion,
  id_pais
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

    const validarCampos = ValidarCampos.validarCamposCrearEstado(
      nombre,
      capital,
      codigoPostal,
      descripcion,
      id_pais
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    const correo = descifrarToken.correo;

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    const datosPais = await prisma.pais.findFirst({
      where: { id: validarCampos.id_pais },
      select: { serial: true, estados: true },
    });

    const nombreRepetido = await prisma.estado.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_pais: validarCampos.id_pais,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones("error", "Error, estado ya existe...", {
        id_usuario: datosUsuario.id,
      });
    }

    const cantidadEstados = datosPais.estados.length + 1;
    const numeroFormateado =
      cantidadEstados < 10 ? `0${cantidadEstados}` : `${cantidadEstados}`;
    const serialEstado = `${datosPais.serial}-${numeroFormateado}`;

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      nombre: validarCampos.nombre,
      capital: validarCampos.capital,
      codigoPostal: validarCampos.codigoPostal,
      descripcion: validarCampos.descripcion,
      serial: serialEstado,
      id_pais: validarCampos.id_pais,
    });
  } catch (error) {
    console.log(`Error, interno al crear estado: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al crear estado"
    );
  }
}
