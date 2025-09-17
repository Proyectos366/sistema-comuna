import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "../ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarEditarParroquia(
  nombre,
  descripcion,
  id_pais,
  id_estado,
  id_municipio,
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

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: {
        id: true,
      },
    });

    if (descifrarToken.id_rol !== 1) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no tiene permiso",
        { id_usuario: datosUsuario.id }
      );
    }

    const validandoCampos = ValidarCampos.validarCamposEditarParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    const existente = await prisma.parroquia.findFirst({
      where: {
        nombre: validandoCampos.nombre,
        id_municipio: validandoCampos.id_municipio,
        id: {
          not: validandoCampos.id_parroquia,
        },
      },
    });

    if (existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error, la parroquia ya existe",
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      descripcion: validandoCampos.descripcion,
      id_usuario: datosUsuario.id,
      id_pais: validandoCampos.id_pais,
      id_estado: validandoCampos.id_estado,
      id_municipio: validandoCampos.id_municipio,
      id_parroquia: validandoCampos.id_parroquia,
    });
  } catch (error) {
    console.log("Error interno validar editar parroquia: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error, interno validar editar parroquia..."
    );
  }
}
