import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const cargos = [
      { nombre: "EJECUTIVO", id_usuario: 1, borrado: false },
      { nombre: "FINANZA", id_usuario: 1, borrado: false },
      { nombre: "CONTRALORIA", id_usuario: 1, borrado: false },
    ];

    for (const cargo of cargos) {
      const existente = await prisma.cargo.upsert({
        where: {
          nombre: cargo.nombre,
          id_usuario: cargo.id_usuario,
          borrado: false,
        },
        update: {}, // Aquí puedes especificar los valores a actualizar si el registro existe
        create: {
          nombre: cargo.nombre,
          id_usuario: cargo.id_usuario,
          borrado: false,
        }, // Aquí se definen los valores para crear el registro si no existe
      });

      if (!existente) {
        await prisma.cargo.create({ data: cargo });
      } else {
        await prisma.cargo.update({
          where: { id: existente.id },
          data: cargo, // Puedes modificarlo según tu lógica
        });
      }
    }
    return generarRespuesta("ok", "Cargos creados correctamente.", {}, 201);
  } catch (error) {
    console.error("Error al guardar cargos:", error);
    return generarRespuesta(
      "error",
      "Error interno al guardar cargos.",
      {},
      500
    );
  }
}
