import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const paises = [
      {
        nombre: "venezuela",
        capital: "caracas",
        serial: "ven",
        id_usuario: 1,
      },
    ];

    for (const pais of paises) {
      const existente = await prisma.pais.findFirst({
        where: {
          nombre: pais.nombre,
          capital: pais.capital,
          serial: pais.serial,
          id_usuario: pais.id_usuario,
        },
      });

      if (!existente) {
        await prisma.pais.create({ data: pais });
      } else {
        await prisma.pais.update({
          where: { id: existente.id },
          data: pais, // Puedes modificarlo según tu lógica
        });
      }
    }

    return generarRespuesta(
      "ok",
      "Paises creados o actualizados correctamente.",
      {},
      201
    );
  } catch (error) {
    console.error("Error al guardar paises:", error);
    return generarRespuesta(
      "error",
      "Error interno al guardar paises.",
      {},
      500
    );
  }
}
