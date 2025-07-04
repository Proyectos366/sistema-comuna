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

    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposRegistroVocero(
      nombre,
      nombre_dos,
      apellido,
      apellido_dos,
      cedula,
      correo,
      genero,
      edad,
      telefono
    );

    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correoUsuarioActivo },
      select: {
        id: true,
      },
    });

    const usuarioId = Number(idUsuario.id);
    const parroquiaId = Number(id_parroquia);
    const comunaId = id_comuna ? Number(id_comuna) : null;
    const circuitoId = id_circuito ? Number(id_circuito) : null;
    const consejoId = id_consejo ? Number(id_consejo) : null;

    const nombreMinuscula = nombre ? nombre.toLowerCase() : null;
    const nombre_dosMinuscula = nombre_dos ? nombre_dos.toLowerCase() : null;
    const apellidoMinuscula = apellido ? apellido.toLowerCase() : null;
    const apellido_dosMinuscula = apellido_dos
      ? apellido_dos.toLowerCase()
      : null;

    const correoMinuscula = correo ? correo.toLowerCase() : null;

    const direccionMinuscula = direccion ? direccion.toLowerCase() : null;
    const laboralMinuscula = laboral ? laboral.toLowerCase() : null;
    const generoNumero = genero ? Number(genero) : null;

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
        {},
        404
      );
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: nombreMinuscula,
      nombreDos: nombre_dosMinuscula,
      apellido: apellidoMinuscula,
      apellidoDos: apellido_dosMinuscula,
      cedula: validandoCampos.cedula,
      genero: generoNumero === 1 ? true : false,
      edad: validandoCampos.edad,
      telefono: validandoCampos.telefono,
      direccion: direccionMinuscula,
      correo: correoMinuscula,
      laboral: laboralMinuscula,
      fechaNacimiento: fechaNacimiento,
      id_usuario: usuarioId,
      id_comuna: comunaId,
      id_consejo: consejoId,
      id_circuito: circuitoId,
      id_parroquia: parroquiaId,
    });
  } catch (error) {
    console.log(`Error, interno al editar vocero: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al editar vocero..."
    );
  }
}
