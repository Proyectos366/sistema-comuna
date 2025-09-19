import ValidarCampos from "@/services/ValidarCampos";
import prisma from "@/libs/prisma";
import CifrarDescifrarClaves from "@/libs/CifrarDescifrarClaves";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCambiarClaveLogueado(
  claveVieja,
  claveUno,
  claveDos
) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const claveUsuarioActivo = await prisma.usuario.findFirst({
      where: { correo: validaciones.correo },
      select: {
        clave: true,
        id: true,
      },
    });

    if (!claveUsuarioActivo) {
      return retornarRespuestaFunciones("error", "Error, usuario invalido...", {
        id_usuario: validaciones.id_usuario,
      });
    }

    const validandoCampos = ValidarCampos.validarCampoClave(claveUno, claveDos);

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    const comparada = await CifrarDescifrarClaves.compararClave(
      claveVieja,
      claveUsuarioActivo.clave
    );

    if (comparada.status === "error") {
      return retornarRespuestaFunciones(comparada.status, comparada.message, {
        id_usuario: validaciones.id_usuario,
      });
    }

    const claveEncriptada = await CifrarDescifrarClaves.cifrarClave(claveUno);

    if (claveEncriptada.status === "error") {
      return retornarRespuestaFunciones(
        claveEncriptada.status,
        claveEncriptada.message,
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion completa", {
      claveEncriptada: claveEncriptada.claveEncriptada,
      id_usuario: validaciones.id_usuario,
    });
  } catch (error) {
    console.error("Error interno validar cambiar clave loggeado: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar cambiar clave loggeado"
    );
  }
}
