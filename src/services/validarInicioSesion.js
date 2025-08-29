import ValidarCampos from "@/services/ValidarCampos";
import prisma from "@/libs/prisma";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import AuthTokens from "@/libs/AuthTokens";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarInicioSesion(correo, clave) {
  try {
    const camposValidados = ValidarCampos.validarCamposLogin(correo, clave);

    if (camposValidados.status === "error") {
      return retornarRespuestaFunciones(
        camposValidados.status,
        camposValidados.message
      );
    }

    const correoMinuscula = correo.toLowerCase();

    const datosInicioSesion = await prisma.usuario.findFirst({
      where: { correo: correoMinuscula },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        correo: true,
        clave: true,
        id_rol: true,
        borrado: true,
        validado: true,
        createdAt: true,
        MiembrosInstitucion: {
          select: {
            id: true,
            nombre: true,
          },
        },
        MiembrosDepartamentos: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!datosInicioSesion) {
      return retornarRespuestaFunciones("error", "Credenciales invalidas...");
    }

    if (!datosInicioSesion.validado) {
      return retornarRespuestaFunciones("error", "Usuario no autorizado...");
    }

    const claveEncriptada = await CifrarDescifrarClaves.compararClave(
      clave,
      datosInicioSesion.clave
    );

    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message
      );
    }

    const redirecciones = {
      1: "/dashboard/master",
      2: "/dashboard/administrador",
      3: "/dashboard/director",
      4: "/dashboard/empleados",
    };
    const redirect =
      redirecciones[datosInicioSesion.id_rol] || "/dashboard/default";

    const crearTokenInicioSesion = AuthTokens.tokenInicioSesion(
      correo,
      datosInicioSesion.id_rol
    );

    if (crearTokenInicioSesion.status === "error") {
      return retornarRespuestaFunciones(
        crearTokenInicioSesion.status,
        crearTokenInicioSesion.message
      );
    }

    return retornarRespuestaFunciones("ok", "Iniciando sesion", {
      token: crearTokenInicioSesion.token,
      cookie: crearTokenInicioSesion.cookieOption,
      redirect: redirect,
      id_usuario: datosInicioSesion.id,
      datosUsuario: datosInicioSesion,
    });
  } catch (error) {
    console.error(`Error interno validar inicio sesion: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar inicio sesion"
    );
  }
}
