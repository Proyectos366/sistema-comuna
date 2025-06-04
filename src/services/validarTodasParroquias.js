import ValidarCampos from "@/services/ValidarCampos";
import prisma from "@/libs/prisma";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarTodasParroquias(
  cedula,
  nombre,
  correo,
  claveUno,
  claveDos
) {
  try {
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
        OR: [{ correo: correo }, { cedula: cedula }],
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

    const correoLetrasMinusculas = correo.toLowerCase();

    return retornarRespuestaFunciones(
      msjCorrectos.ok,
      msjCorrectos.okCrearUsuario.encriptarCorrecto,
      {
        claveEncriptada: claveEncriptada.claveEncriptada,
        correo: correoLetrasMinusculas
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
