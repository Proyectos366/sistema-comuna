import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearFormacion(
  nombre,
  cantidadModulos,
  descripcion
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

    const validandoCampos = ValidarCampos.validarCamposCrearFormacion(
      nombre,
      cantidadModulos,
      descripcion
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const correo = descifrarToken.correo;

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo },
      include: {
        MiembrosInstitucion: {
          select: { id: true },
        },
        MiembrosDepartamentos: {
          select: { id: true },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones(
        "error",
        "Error, usuario no encontrado..."
      );
    }

    const nombreRepetido = await prisma.formacion.findFirst({
      where: {
        nombre: validandoCampos.nombre,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, formacion ya existe...",
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    const todoscantidadModulos = await prisma.modulo.findMany({
      where: { borrado: false },
      select: { id: true },
      take: validandoCampos.cantidadModulos,
      orderBy: {
        id: "asc",
      },
    });

    if (!todoscantidadModulos || todoscantidadModulos.length === 0) {
      return retornarRespuestaFunciones(
        "error",
        "Error, no hay cantidad modulos...",
        {
          id_usuario: datosUsuario.id,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      nombre: validandoCampos.nombre,
      cantidadModulos: validandoCampos.cantidadModulos,
      todosModulos: todoscantidadModulos,
      descripcion: validandoCampos.descripcion,
      id_institucion: datosUsuario?.MiembrosInstitucion?.[0]?.id
        ? datosUsuario?.MiembrosInstitucion?.[0]?.id
        : null,
      id_departamento: datosUsuario?.MiembrosDepartamentos?.[0]?.id
        ? datosUsuario?.MiembrosDepartamentos?.[0]?.id
        : null,
    });
  } catch (error) {
    console.log(`Error interno validar crear formacion: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear formacion"
    );
  }
}
