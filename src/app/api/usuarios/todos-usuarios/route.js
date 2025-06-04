import prisma from "@/libs/prisma";
import AuthTokens from "@/libs/AuthTokens";
import { cookies } from "next/headers";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/consultar_todos_usuarios/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/consultar_todos_usuarios/msjCorrectos.json";
import nombreToken from "@/utils/nombreToken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

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

    const todosUsuarios = await prisma.usuario.findMany({
      where: {
        correo: {
          not: {
            in: [correo, 'master@gmail.com'],
          },
        },
      },
      orderBy: {
        nombre: "asc",
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
        { todosUsuarios: todosUsuarios },
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
