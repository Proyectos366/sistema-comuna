import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/consultar_todos_usuarios/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/consultar_todos_usuarios/msjCorrectos.json";
import validarConsultarTodosUsuarios from "@/services/validarConsultarTodosUsuarios";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodosUsuarios();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todosUsuarios = await prisma.usuario.findMany({
      where: {
        correo: {
          not: {
            in: [validaciones.correo, "carlosjperazab@gmail.com"],
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
      include: {
        MiembrosDepartamentos: true,
      },
    });

    if (!todosUsuarios) {
      return generarRespuesta(
        msjErrores.error,
        msjErrores.errorConsultarTodosUsuarios.usuariosNoEncontrados,
        {},
        msjErrores.codigo.codigo400
      );
    } else {
      return generarRespuesta(
        msjCorrectos.ok,
        msjCorrectos.okConsultarTodosUsuarios.usuariosEncontrados,
        { usuarios: todosUsuarios },
        msjCorrectos.codigo.codigo200
      );
    }
  } catch (error) {
    console.log(`${msjErrores.errorMixto}: ` + error);

    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorConsultarTodosUsuarios.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
