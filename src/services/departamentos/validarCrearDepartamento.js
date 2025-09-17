import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

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

    const validarCampos = ValidarCampos.validarCamposCrearDepartamento(
      nombre,
      descripcion
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: descifrarToken.correo },
      select: {
        id: true,
        MiembrosInstitucion: {
          select: { id: true },
        },
        MiembrosDepartamentos: {
          select: {
            id: true,
            id_institucion: true,
          },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario no existe...");
    }

    const institucion_id = datosUsuario.MiembrosInstitucion?.[0]?.id;

    const nombreRepetido = await prisma.departamento.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_institucion: institucion_id,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, departamento ya existe...",
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      id_institucion: institucion_id,
    });
  } catch (error) {
    console.log(`Error interno validar crear departamento: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear departamento"
    );
  }
}
