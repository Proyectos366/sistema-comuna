import ValidarCampos from "../ValidarCampos";
import prisma from "@/libs/prisma";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function validarCrearUsuario(
  cedula,
  nombre,
  apellido,
  correo,
  claveUno,
  claveDos
) {
  try {
    const validandoCampos = ValidarCampos.validarCamposRegistro(
      cedula,
      nombre,
      apellido,
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
      return retornarRespuestaFunciones("error", "Error, usuario ya existe");
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
    });
  } catch (error) {
    console.error(`Error interno, validar crear usuario: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error interno, validar crear usuario"
    );
  }
}
