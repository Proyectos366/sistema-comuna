import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";

export default async function validarCrearUsuario(
  cedula,
  nombre,
  apellido,
  correo,
  claveUno,
  claveDos,
  id_rol,
  autorizar,
  institucione
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

    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { correo: validandoCampos.correo },
          { cedula: validandoCampos.cedula },
        ],
      },
    });

    if (usuarioExistente) {
      return retornarRespuestaFunciones("error", "Error, usuario ya existe");
    }

    let datosInstitucion;

    if (descifrarToken.id_rol === 1) {
      datosInstitucion = [];
    } else {
      datosInstitucion = await prisma.institucion.findFirst({
        where: {
          id: institucione?.[0]?.id,
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

    // Encriptar clave
    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas", {
      cedula: validandoCampos.cedula,
      nombre: validandoCampos.nombre,
      apellido: validandoCampos.apellido,
      claveEncriptada: claveEncriptada.claveEncriptada,
      correo: validandoCampos.correo,
      id_rol: validandoCampos.id_rol,
      autorizar: validandoCampos.autorizar,
      institucion: datosInstitucion,
    });
  } catch (error) {
    console.error(`Error interno, validar crear usuario: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error interno, validar crear usuario"
    );
  }
}
