import ValidarCampos from "@/services/ValidarCampos";
import prisma from "@/libs/prisma";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import msjErrores from "../msj_validaciones/crear_usuario/msjErrores.json";
import msjCorrectos from "../msj_validaciones/crear_usuario/msjCorrectos.json";

export default async function validarCrearUsuario(
  cedula,
  nombre,
  correo,
  claveUno,
  claveDos
) {
  try {
    const cedulaSinPunto = cedula.replace(/\./g, "");
    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposRegistro(
      cedula,
      nombre,
      correo,
      claveUno,
      claveDos
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
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorCrearUsuario.usuarioExiste
      );
    }

    // Encriptar clave
    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message
      );
    }

    return retornarRespuestaFunciones(
      msjCorrectos.ok,
      msjCorrectos.okCrearUsuario.encriptarCorrecto,
      {
        cedula: validandoCampos.cedula,
        nombre: validandoCampos.nombre,
        claveEncriptada: claveEncriptada.claveEncriptada,
        correo: validandoCampos.correo,
      }
    );
  } catch (error) {
    console.error(`${msjErrores.errorMixto}: ` + error);
    return retornarRespuestaFunciones(
      msjErrores.error,
      msjErrores.errorCrearUsuario.internoValidando
    );
  }
}
