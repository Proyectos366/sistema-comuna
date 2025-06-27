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

    // const todosCursando = await prisma.cursando.findMany({
    //   where: {
    //     borrado: false,
    //   },
    // });

    const cursandoData = await prisma.cursando.findMany({
      where: {
        borrado: false,
      },
      select: {
        cedula: true,
        edad: true,
        genero: true,
        id_parroquia: true,
        id_comuna: true,
        id_consejo: true,
        id_clase: true,
      },
    });

    const parroquias = await prisma.parroquia.findMany();
    const comunas = await prisma.comuna.findMany();
    const consejos = await prisma.consejo.findMany();
    const clases = await prisma.clase.findMany();

    const todosCursando = cursandoData.map((c) => ({
      cedula: c.cedula,
      edad: c.edad,
      genero: c.genero,
      parroquia:
        parroquias.find((p) => p.id === c.id_parroquia)?.nombre ?? null,
      comuna: comunas.find((co) => co.id === c.id_comuna)?.nombre ?? null,
      consejo: consejos.find((con) => con.id === c.id_consejo)?.nombre ?? null,
      clase: clases.find((cl) => cl.id === c.id_clase)?.nombre ?? null,
    }));

    if (!todosCursando) {
      return generarRespuesta(
        "error",
        "Error, al consultar cursandos...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todos los cursandos...",
        {
          cursandos: todosCursando,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (cursandos): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (cursandos)",
      {},
      500
    );
  }
}
