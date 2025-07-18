import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(request) {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { searchParams } = new URL(request.url);
    const idParroquia = searchParams.get("idParroquia");

    const idParroquiaNumero = Number(idParroquia);

    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    if (!idParroquia) {
      return generarRespuesta("error", "Id parroquia vacio...", {}, 400);
    }

    const voceroPorParroquia = await prisma.vocero.findMany({
      where: {
        id_parroquia: idParroquiaNumero,
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
          select: { nombre: true, id: true, id_parroquia: true },
        },
        circuitos: {
          select: { nombre: true, id: true },
        },
        parroquias: {
          select: { nombre: true },
        },
        consejos: {
          select: { nombre: true },
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
        cargos: {
          select: { nombre: true, id: true },
        },
      },
    });

    if (!voceroPorParroquia) {
      return generarRespuesta("error", "Error, no hay voceros...", {}, 400);
    }

    return generarRespuesta(
      "ok",
      "Voceros encontrados...",
      { voceros: voceroPorParroquia },
      200
    );
  } catch (error) {
    console.log(`Error interno, al consultar vocero por parroquia: ${error}`);

    return generarRespuesta(
      "error",
      "Error interno al consultar vocero por parroquia...",
      {},
      500
    );
  }
}

/**
 const cursos = voceroPorParroquia.cursos.map(curso => {
  const modulosIncompletos = curso.modulos.filter(modulo => {
    return modulo.asistencias.length === 0;
  });

  return {
    curso: curso.nombre,
    modulosPendientes: modulosIncompletos.map(m => m.nombre),
  };
});
 */
