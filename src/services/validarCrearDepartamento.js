import ValidarCampos from "@/services/ValidarCampos";
import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import msjErrores from "../msj_validaciones/crear_departamento/msjErrores.json";
import msjCorrectos from "../msj_validaciones/crear_departamento/msjCorrectos.json";

export default async function validarCrearDepartamento(
  nombre,
  descripcion,
  alias
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    // Validar campos
    const validandoCampos = ValidarCampos.validarCamposRegistroDepartamento(
      nombre,
      descripcion,
      alias
    );
    if (validandoCampos.status === "error") {
      return retornarRespuestaFunciones(
        validandoCampos.status,
        validandoCampos.message
      );
    }

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return generarRespuesta(
        descifrarToken.status,
        descifrarToken.message,
        {},
        msjErrores.codigo.codigo400
      );
    }

    const correo = descifrarToken.correo;

    const idUsuarioCreador = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    // Verificar si el departamento ya existe
    const departamentoExistente = await prisma.departamento.findFirst({
      where: { nombre: validandoCampos.nombre },
    });

    if (departamentoExistente) {
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorCrearDepartamento.departamentoExiste
      );
    }

    const cantidadDepartamento = await prisma.departamento.count();
    const numeroCodigo = cantidadDepartamento
      ? String(cantidadDepartamento).padStart(4, "0")
      : "0000";
    const codigoNuevo = "DEP-" + numeroCodigo;

    return retornarRespuestaFunciones(
      msjCorrectos.ok,
      msjCorrectos.okCrearDepartamento.creandoDepartamento,
      {
        codigo: codigoNuevo,
        id_creador: idUsuarioCreador.id,
        nombre: validandoCampos.nombre,
      }
    );
  } catch (error) {
    console.error(`${msjErrores.errorMixto}: ` + error);
    return retornarRespuestaFunciones(
      msjErrores.error,
      msjErrores.errorCrearDepartamento.internoValidando
    );
  }
}
