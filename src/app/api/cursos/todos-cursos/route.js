import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
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

    const correo = descifrarToken.correo;

    //const todosCursos = await prisma.curso.findMany();

    const todosCursos = await prisma.curso.findMany({
      where: { verificado: false }, // Filtrar cursos aún no verificados
      include: {
        voceros: true, // Obtener datos del vocero
        formaciones: {
          where: { culminada: false },
          include: { modulos: true }, // Obtener módulos de la formación
        },
        asistencias: {
          where: { presente: true }, // Filtrar módulos aprobados
        },
      },
    });

    if (!todosCursos) {
      return generarRespuesta(
        "error",
        "Error, al consultar cursos...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas los cursos...",
        {
          cursos: todosCursos,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (cursos): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (cursos)",
      {},
      500
    );
  }
}
