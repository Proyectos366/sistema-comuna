import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const parroquias = [
      {
        nombre: "villa de cura",
        serial: "ven-01-2025-est-04-mun-01-par-01",
        id_municipio: 16,
        id_usuario: 1,
      },
      {
        nombre: "magdaleno",
        serial: "ven-01-2025-est-04-mun-01-par-02",
        id_municipio: 16,
        id_usuario: 1,
      },
      {
        nombre: "valle de tucutunemo",
        serial: "ven-01-2025-est-04-mun-01-par-03",
        id_municipio: 16,
        id_usuario: 1,
      },
      {
        nombre: "san francisco",
        serial: "ven-01-2025-est-04-mun-01-par-04",
        id_municipio: 16,
        id_usuario: 1,
      },
      {
        nombre: "augusto mijares",
        serial: "ven-01-2025-est-04-mun-01-par-05",
        id_municipio: 16,
        id_usuario: 1,
      },
    ];

    const existentes = await prisma.parroquia.findMany({
      where: {
        serial: {
          in: parroquias.map((e) => e.serial),
        },
      },
    });

    const existentesMap = new Map(existentes.map((e) => [e.serial, e]));

    for (const parroquia of parroquias) {
      const existente = existentesMap.get(parroquia.serial);

      if (!existente) {
        await prisma.parroquia.create({ data: parroquia });
      } else {
        await prisma.parroquia.update({
          where: { id: existente.id },
          data: parroquia,
        });
      }
    }

    return generarRespuesta(
      "ok",
      "Parroquias creadas o actualizadas correctamente.",
      {},
      201
    );
  } catch (error) {
    console.error("Error al guardar parroquias:", error);
    return generarRespuesta(
      "error",
      "Error interno al guardar parroquias.",
      {},
      500
    );
  }
}
