import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearUsuario(
  cedula,
  nombre,
  apellido,
  correo,
  claveUno,
  claveDos,
  id_rol,
  autorizar,
  instituciones
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

    const correoDescifrado = descifrarToken.correo;

    const datosUsuario = await prisma.usuario.findFirst({
      where: { correo: correoDescifrado },
      select: {
        id: true,
        MiembrosInstitucion: {
          select: { id: true, nombre: true },
        },
        MiembrosDepartamentos: {
          select: { id: true, nombre: true },
        },
      },
    });

    const validandoCampos = ValidarCampos.validarCamposRegistro(
      cedula,
      nombre,
      apellido,
      correo,
      claveUno,
      claveDos,
      id_rol,
      autorizar
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const tokenAuth = AuthTokens.tokenValidarUsuario(10);

    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { correo: validandoCampos.correo },
          { cedula: validandoCampos.cedula },
          { token: tokenAuth },
        ],
      },
    });

    if (usuarioExistente) {
      return retornarRespuestaFunciones("error", "Error, usuario ya existe");
    }

    let datosInstitucion;

    if (descifrarToken.id_rol === 1) {
      datosInstitucion = await prisma.institucion.findFirst({
        where: {
          id: instituciones?.[0].id,
        },
        select: {
          id: true,
          id_pais: true,
          id_estado: true,
          id_municipio: true,
          id_parroquia: true,
        },
      });
    } else {
      datosInstitucion = await prisma.institucion.findFirst({
        where: {
          id: datosUsuario?.MiembrosInstitucion?.[0].id,
        },
        select: {
          id: true,
          id_pais: true,
          id_estado: true,
          id_municipio: true,
          id_parroquia: true,
        },
      });
    }

    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas", {
      id_usuario: datosUsuario.id,
      cedula: validandoCampos.cedula,
      nombre: validandoCampos.nombre,
      apellido: validandoCampos.apellido,
      claveEncriptada: claveEncriptada.claveEncriptada,
      correo: validandoCampos.correo,
      id_rol: validandoCampos.id_rol,
      autorizar: validandoCampos.autorizar,
      institucion: datosInstitucion,
      id_institucion: [{ id: datosInstitucion.id }],
      id_creador: datosUsuario.id,
      token: tokenAuth,
    });
  } catch (error) {
    console.error(`Error interno validar crear usuario: ` + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear usuario"
    );
  }
}
