import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "@/services/ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import { calcularFechaNacimientoPorEdad } from "@/utils/Fechas";

export default async function validarEditarVocero(
  nombre,
  nombre_dos,
  apellido,
  apellido_dos,
  cedula,
  correo,
  genero,
  edad,
  telefono,
  direccion,
  laboral,
  id_parroquia,
  id_comuna,
  id_consejo,
  id_circuito
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

    const correoUsuarioActivo = descifrarToken.correo;

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correoUsuarioActivo },
      select: {
        id: true,
      },
    });

    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposEditarVocero(
      nombre,
      nombre_dos,
      apellido,
      apellido_dos,
      cedula,
      correo,
      genero,
      edad,
      telefono,
      direccion,
      laboral,
      id_parroquia,
      id_comuna,
      id_consejo,
      id_circuito
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message,
        {
          id_usuario: idUsuario.id,
        }
      );
    }

    const fechaNacimiento = calcularFechaNacimientoPorEdad(
      validandoCampos.edad
    );

    const existente = await prisma.vocero.findUnique({
      where: { cedula: validandoCampos.cedula },
    });

    if (!existente) {
      return retornarRespuestaFunciones(
        "error",
        "Error el vocero no existe",
        { id_usuario: idUsuario.id },
        404
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: validandoCampos.nombre,
      nombreDos: validandoCampos.nombre_dos,
      apellido: validandoCampos.apellido,
      apellidoDos: validandoCampos.apellido_dos,
      cedula: validandoCampos.cedula,
      genero: validandoCampos.genero,
      edad: validandoCampos.edad,
      telefono: validandoCampos.telefono,
      direccion: validandoCampos.direccion,
      correo: validandoCampos.correo,
      laboral: validandoCampos.laboral,
      fechaNacimiento: fechaNacimiento,
      id_usuario: idUsuario.id,
      id_parroquia: validandoCampos.id_parroquia,
      id_comuna: validandoCampos.id_comuna,
      id_circuito: validandoCampos.id_circuito,
      id_consejo: validandoCampos.consejo,
    });
  } catch (error) {
    console.log(`Error, interno al editar vocero: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar vocero..."
    );
  }
}
