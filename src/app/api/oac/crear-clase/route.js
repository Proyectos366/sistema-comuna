import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";

export async function POST(request) {
  try {
    const { nombre } = await request.json();
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
    const nombreMinuscula = nombre.toLowerCase();

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    const nuevaClase = await prisma.clase.create({
      data: {
        nombre: nombreMinuscula,
        id_usuario: idUsuario.id,
      },
    });

    if (!nuevaClase) {
      return generarRespuesta("error", "Error, no se creo la clase", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Clase creada...",
        {
          clase: nuevaClase,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (formaciones): ` + error);

    return generarRespuesta("error", "Error, interno (formaciones)", {}, 500);
  }
}

/**
  // Recibiendo por parametro los cantidadModulos que quiero puedo usar esta consulta
  const todoscantidadModulos = await prisma.modulo.findMany({
    where: {
      borrado: false,
        id: {
          in: cantidadModulos, // cantidadModulos debe ser un array de IDs que tú escojas
        },
    },
    select: { id: true },
  });
*/
