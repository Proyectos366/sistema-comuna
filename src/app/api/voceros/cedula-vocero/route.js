import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import { quitarCaracteres } from "@/utils/quitarCaracteres";

export async function POST(request) {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { cedula } = await request.json();

    const cedulaLimpia = quitarCaracteres(cedula);
    const cedulaNumero = Number(cedulaLimpia);

    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    if (!cedula) {
      return generarRespuesta("error", "Campo cedula vacio...", {}, 400);
    }

    const voceroPorCedula = await prisma.vocero.findUnique({
      where: {
        cedula: cedulaNumero,
      },
      select: {
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
      },
    });

    if (!voceroPorCedula) {
      return generarRespuesta(
        "error",
        "Error, no existe el vocero...",
        {},
        400
      );
    }

    return generarRespuesta(
      "ok",
      "Vocero encontrado...",
      { vocero: voceroPorCedula },
      200
    );
  } catch (error) {
    console.log(`Error interno, al consultar vocero por cedula: ${error}`);

    return generarRespuesta(
      "error",
      "Error interno al consultar vocero...",
      {},
      500
    );
  }
}

/**
 const cursos = voceroPorCedula.cursos.map(curso => {
  const modulosIncompletos = curso.modulos.filter(modulo => {
    return modulo.asistencias.length === 0;
  });

  return {
    curso: curso.nombre,
    modulosPendientes: modulosIncompletos.map(m => m.nombre),
  };
});
 */
