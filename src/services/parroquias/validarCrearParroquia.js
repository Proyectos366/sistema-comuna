import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearParroquia(
  nombre,
  descripcion,
  id_pais,
  id_estado,
  id_municipio
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

    const validarCampos = ValidarCampos.validarCamposCrearParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio
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

    const datosMunicipio = await prisma.municipio.findFirst({
      where: { id: validarCampos.id_municipio },
      select: { serial: true, parroquias: true },
    });

    const nombreRepetido = await prisma.parroquia.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_municipio: validarCampos.id_municipio,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, parroquia ya existe...",
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    const cantidadParroquias = datosMunicipio.parroquias.length + 1;
    const numeroFormateado =
      cantidadParroquias < 10
        ? `0${cantidadParroquias}`
        : `${cantidadParroquias}`;
    const serialParroquia = `${datosMunicipio.serial}-${numeroFormateado}`;

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      serial: serialParroquia,
      id_pais: validarCampos.id_pais,
      id_estado: validarCampos.id_estado,
      id_municipio: validarCampos.id_municipio,
    });
  } catch (error) {
    console.log(`Error interno validar crear parroquia: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear parroquia"
    );
  }
}
