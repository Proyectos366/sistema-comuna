import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const municipios = [
      {
        nombre: "bolívar",
        serial: "ven-01-01",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "camatagua",
        serial: "ven-01-02",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "francisco linares alcántara",
        serial: "ven-01-03",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "girardot",
        serial: "ven-01-04",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "josé ángel lamas",
        serial: "ven-01-05",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "josé félix ribas",
        serial: "ven-01-06",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "josé rafael revenga",
        serial: "ven-01-07",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "libertador",
        serial: "ven-01-08",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "mario briceño iragorry",
        serial: "ven-01-09",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "san casimiro",
        serial: "ven-01-10",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "san sebastián",
        serial: "ven-01-11",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "santiago mariño",
        serial: "ven-01-12",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "sucre",
        serial: "ven-01-13",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "tovar",
        serial: "ven-01-14",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "urdaneta",
        serial: "ven-01-15",
        id_estado: 4,
        id_usuario: 1,
      },
      {
        nombre: "zamora",
        serial: "ven-01-16",
        id_estado: 4,
        id_usuario: 1,
      },
    ];

    const existentes = await prisma.municipio.findMany({
      where: {
        serial: {
          in: municipios.map((e) => e.serial),
        },
      },
    });

    const existentesMap = new Map(existentes.map((e) => [e.serial, e]));

    for (const municipio of municipios) {
      const existente = existentesMap.get(municipio.serial);

      if (!existente) {
        await prisma.municipio.create({ data: municipio });
      } else {
        await prisma.municipio.update({
          where: { id: existente.id },
          data: municipio,
        });
      }
    }

    return generarRespuesta(
      "ok",
      "Municipios creados o actualizados correctamente.",
      {},
      201
    );
  } catch (error) {
    console.error("Error al guardar municipios:", error);
    return generarRespuesta(
      "error",
      "Error interno al guardar municipios.",
      {},
      500
    );
  }
}
