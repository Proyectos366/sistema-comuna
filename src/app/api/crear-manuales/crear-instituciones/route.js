import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const instituciones = [
      {
        nombre: "contraloria del municipio zamora",
        descripcion: "contraloria del municipio zamora del estado aragua",
        rif: "G-20001980-8",
        sector: "la coromoto",
        direccion: "calle principal",
        id_usuario: 1,
        id_pais: 1,
        id_estado: 4,
        id_municipio: 16,
      },
    ];

    const existentes = await prisma.institucion.findMany({
      where: {
        rif: {
          in: instituciones.map((e) => e.rif),
        },
      },
    });

    const existentesMap = new Map(existentes.map((e) => [e.rif, e]));

    for (const institucion of instituciones) {
      const existente = existentesMap.get(institucion.rif);

      if (!existente) {
        await prisma.institucion.create({ data: institucion });
      } else {
        await prisma.institucion.update({
          where: { id: existente.id },
          data: institucion,
        });
      }
    }

    return generarRespuesta(
      "ok",
      "instituciones creados o actualizados correctamente.",
      {},
      201
    );
  } catch (error) {
    console.log("Error, al guardar instituciones: " + error);
    return generarRespuesta(
      "error",
      "Error interno al guardar instituciones.",
      {},
      500
    );
  }
}
