import path from "path";
import fs from "fs";
import ValidarCampos from "@/services/ValidarCampos";
import prisma from "@/libs/prisma";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import AuthTokens from "@/libs/AuthTokens";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import msjErrores from "../msj_validaciones/login/msjErrores.json";
import msjCorrectos from "../msj_validaciones/login/msjCorrectos.json";

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
      where: {
        correo: correoMinuscula,
      },
    });

    if (!datosInicioSesion) {
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.credencialesInvalidas
      );
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

    const rutaCarpeta = path.resolve(
      process.cwd(),
      "public",
      "uploads",
      String(datosInicioSesion.id)
    );

    // Verificar si la carpeta existe antes de intentar acceder a ella
    if (fs.existsSync(rutaCarpeta)) {
      // Leer archivos dentro de la carpeta y eliminarlos
      const archivos = fs.readdirSync(rutaCarpeta);

      archivos.forEach((archivo) => {
        const rutaArchivo = path.join(rutaCarpeta, archivo);
        fs.unlinkSync(rutaArchivo);
      });
    }

    return retornarRespuestaFunciones(
      msjCorrectos.ok,
      msjCorrectos.validacionCorrecta,
      {
        token: crearTokenInicioSesion.token,
        cookie: crearTokenInicioSesion.cookieOption,
        redirect: redirect,
        id_usuario: datosInicioSesion.id,
      }
    );
  } catch (error) {
    console.error(`${msjErrores.errorLogin.internoValidando}: ` + error);
    return retornarRespuestaFunciones(
      msjErrores.error,
      msjErrores.errorLogin.internoValidando
    );
  }
}
