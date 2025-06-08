import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import ValidarCampos from "@/services/ValidarCampos";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import { phoneRegex } from "@/utils/constantes";

export default async function validarCrearVocero(
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
  proyecto,
  certificado,
  verificado,
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
      edad
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
        id: true, // Selecciona solo el campo 'id'
      },
    });

    const usuarioId = Number(idUsuario.id);
    const parroquiaId = Number(id_parroquia);
    const comunaId = id_comuna ? Number(id_comuna) : null;
    const circuitoId = id_circuito ? Number(id_circuito) : null;
    const consejoId = id_consejo ? Number(id_consejo) : null;

    const edadNumero = Number(edad);

    if (isNaN(edadNumero) || edadNumero <= 0) {
      // Si es NaN, o si es 0 o negativo (que no suelen ser edades válidas)
      return retornarRespuestaFunciones(
        "error",
        "Error, edad inválida [18-99]..."
      );
    }

    // Opcional: Rango de edad (ej. no más de 120 años)
    if (edadNumero > 99) {
      return retornarRespuestaFunciones("error", "Error, edad muy alta....");
    }

    if (edadNumero < 18) {
      return retornarRespuestaFunciones(
        "error",
        "Error, es un menor de edad...."
      );
    }

    const telefonoValidado = telefono ? phoneRegex.test(telefono) : "";

    if (telefono && !telefonoValidado) {
      return retornarRespuestaFunciones(
        "error",
        "Error, formato telefono invalido..."
      );
    }

    let tokenVocero;
    let tokenEnUsoEnDB;

    do {
      tokenVocero = AuthTokens.tokenValidarUsuario(10);
      tokenEnUsoEnDB = await prisma.vocero.findFirst({
        where: { token: tokenVocero },
      });
    } while (tokenEnUsoEnDB);

    // Verificar si el usuario ya existe
    const voceroExistente = await prisma.vocero.findFirst({
      where: { cedula: cedula },
    });

    if (voceroExistente) {
      return retornarRespuestaFunciones("error", "Error, vocero ya existe...");
    }

    return retornarRespuestaFunciones("ok", "Validaciones correctas...", {
      nombre: (nombre = nombre.toLowerCase()),
      nombreDos: nombre_dos ? nombre_dos.toLowerCase() : "",
      apellido: apellido.toLowerCase(),
      apellidoDos: apellido_dos ? apellido_dos.toLowerCase() : "",
      cedula: cedula,
      genero: genero,
      edad: edadNumero,
      telefono: telefonoValidado,
      direccion: direccion,
      correo: correo ? correo.toLowerCase() : "",
      token: tokenVocero,
      proyecto: proyecto,
      certificado: certificado,
      verificado: verificado,
      borrado: false,
      id_usuario: usuarioId,
      id_comuna: comunaId,
      id_consejo: consejoId,
      id_circuito: circuitoId,
      id_parroquia: parroquiaId,
    });
  } catch (error) {
    console.log(`Error, interno al validar vocero: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno al validar vocero..."
    );
  }
}
