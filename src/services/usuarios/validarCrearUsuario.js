import prisma from "@/libs/prisma";
import AuthTokens from "@/libs/AuthTokens";
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
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
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

    if (validaciones.id_rol === 1) {
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
          id: validaciones.id_institucion,
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
      id_usuario: validaciones.id_usuario,
      cedula: validandoCampos.cedula,
      nombre: validandoCampos.nombre,
      apellido: validandoCampos.apellido,
      claveEncriptada: claveEncriptada.claveEncriptada,
      correo: validandoCampos.correo,
      id_rol: validandoCampos.id_rol,
      autorizar: validandoCampos.autorizar,
      institucion: datosInstitucion,
      id_institucion: [{ id: datosInstitucion.id }],
      id_creador: validaciones.id_usuario,
      token: tokenAuth,
    });
  } catch (error) {
    console.log("Error interno validar crear usuario: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear usuario"
    );
  }
}
