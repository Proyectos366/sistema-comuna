import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function POST(request) {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { cedula } = await request.json();

    const cedulaNumero = Number(cedula);

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

    //const voceroPorCedula = false;

    /**
    const voceroPorCedula = await prisma.vocero.findUnique({
      where: {
        cedula: cedulaNumero,
      },
      include: {
        comunas: true,
        consejos: true,
        cursos: {
          include: {
            formaciones: {
              include: {
                modulos: true,
              },
            },
            asistencias: {
              where: {
                presente: true,
              },
              include: {
                modulos: true,
              },
            },
          },
        },
      },
    });
    */


   const voceroPorCedula = await prisma.curso.findFirst({
  where: {
    borrado: false, // asegura que el curso no esté borrado
    voceros: {
      is: {
        cedula: cedulaNumero, // tu número de cédula dinámico
      },
    },
  },
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
        genero: true,
        comunas: {
          select: {
            nombre: true,
          },
        },
        consejos: {
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
            asistencias: {
              where: { presente: true, borrado: false }, // solo asistencias válidas
              select: {
                id_modulo: true,
                modulos: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    asistencias: {
      where: {
        presente: true,
        borrado: false,
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
