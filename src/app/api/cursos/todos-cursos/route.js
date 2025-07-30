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

    const todosCursos = await prisma.curso.findMany({
      where: { borrado: false },
      include: {
        voceros: {
          select: {
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            cedula: true,
            telefono: true,
            correo: true,
            edad: true,
            f_n: true,
            genero: true,
            comunas: {
              select: {
                nombre: true, // Trae el nombre de la comuna
              },
            },
            consejos: {
              select: {
                nombre: true,
              },
            },
            circuitos: {
              select: {
                nombre: true,
              },
            },
            parroquias: {
              select: {
                nombre: true,
              },
            },
          },
        },
        formaciones: {
          include: {
            modulos: {
              include: {
                asistencias: true, // Relaciona módulos con asistencias
              },
            },
          },
        },
        asistencias: true,
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
