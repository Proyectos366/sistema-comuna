import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarTodasFormaciones() {
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
        id_rol: true,
        MiembrosInstitucion: {
          select: { id: true, nombre: true },
        },
        MiembrosDepartamentos: {
          select: { id: true, nombre: true },
        },
      },
    });

    if (!datosUsuario) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...");
    }

    let whereCondicion;
    const institucion_id = datosUsuario?.MiembrosInstitucion?.[0]?.id;
    const departamento_id = datosUsuario?.MiembrosDepartamentos?.[0]?.id;

    if (datosUsuario.id_rol === 1) {
      // Usuario privilegiado: ver todas las formaciones no borradas ni culminadas
      whereCondicion = {
        borrado: false,
        culminada: false,
      };
    } else if (datosUsuario.id_rol === 2) {
      // Admin o usuario privilegiado: ver todas las formaciones no borradas ni culminadas
      whereCondicion = {
        borrado: false,
        culminada: false,
        id_institucion: institucion_id,
      };
    } else {
      whereCondicion = {
        borrado: false,
        culminada: false,
        OR: [
          { id_institucion: institucion_id }, // Formaciones creadas por el usuario
          { id_departamento: departamento_id }, // Formaciones del departamento del usuario
        ],
      };
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: datosUsuario.id,
      correo: correo,
      condicion: whereCondicion,
      id_institucion: datosUsuario?.MiembrosInstitucion?.[0]?.id,
      id_departamento: datosUsuario?.MiembrosDepartamentos?.[0]?.id,
    });
  } catch (error) {
    console.log(`Error interno validar consultar todas formaciones: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar todas formaciones"
    );
  }
}
