import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearMunicipio(
  nombre,
  descripcion,
  id_pais,
  id_estado
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

    const validarCampos = ValidarCampos.validarCamposCrearMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado
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

    const datosEstado = await prisma.estado.findFirst({
      where: { id: validarCampos.id_estado },
      select: { serial: true, municipios: true },
    });

    const nombreRepetido = await prisma.municipio.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_estado: validarCampos.id_estado,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, municipio ya existe...",
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    const cantidadMunicipios = datosEstado.municipios.length + 1;
    const numeroFormateado =
      cantidadMunicipios < 10
        ? `0${cantidadMunicipios}`
        : `${cantidadMunicipios}`;
    const serialMunicipio = `${datosEstado.serial}-${numeroFormateado}`;

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      serial: serialMunicipio,
      id_pais: validarCampos.id_pais,
      id_estado: validarCampos.id_estado,
    });
  } catch (error) {
    console.log(`Error interno validar crear municipio: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear municipio"
    );
  }
}
