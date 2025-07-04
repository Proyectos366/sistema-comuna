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


    const todosVoceros = await prisma.vocero.findMany({
      where: {
        borrado: false,
      },
      select: {
        id: true,
        nombre: true,
        nombre_dos: true,
        apellido: true,
        apellido_dos: true,
        cedula: true,
        telefono: true,
        correo: true,
        edad: true,
        genero: true,
        laboral: true,
        comunas: {
          select: { nombre: true, id: true, id_parroquia: true},
        },
        circuitos: {
          select: { nombre: true, id: true }
        },
        parroquias: {
          select: { nombre: true },
        },
        consejos: {
          select: { nombre: true, id: true},
        },
        cursos: {
          where: { borrado: false },
          select: {
            verificado: true,
            certificado: true,
            formaciones: {
              select: { nombre: true },
            },
            asistencias: {
              select: {
                id: true,
                presente: true,
                fecha_registro: true,
                modulos: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!todosVoceros) {
      return generarRespuesta("error", "Error, no hay voceros...", {}, 400);
    }

    return generarRespuesta(
      "ok",
      "Voceros encontrados...",
      { voceros: todosVoceros },
      200
    );
  } catch (error) {
    console.log(`Error interno, al consultar todos los voceros: ${error}`);

    return generarRespuesta(
      "error",
      "Error interno al consultar todos los voceros...",
      {},
      500
    );
  }
}

/**
 const cursos = todosVoceros.cursos.map(curso => {
  const modulosIncompletos = curso.modulos.filter(modulo => {
    return modulo.asistencias.length === 0;
  });

  return {
    curso: curso.nombre,
    modulosPendientes: modulosIncompletos.map(m => m.nombre),
  };
});
 */
