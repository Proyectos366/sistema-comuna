import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const parroquias = [
      { nombre: "VILLA DE CURA", id_usuario: 1, borrado: false },
      { nombre: "MAGDALENO", id_usuario: 1, borrado: false },
      { nombre: "VALLE DE TUCUTUNEMO", id_usuario: 1, borrado: false },
      { nombre: "SAN FRANCISCO", id_usuario: 1, borrado: false },
      { nombre: "AUGUSTO MIJARES", id_usuario: 1, borrado: false },
    ];

    for (const parroquia of parroquias) {
      const existente = await prisma.parroquia.findFirst({
        where: {
          nombre: parroquia.nombre,
          id_usuario: parroquia.id_usuario,
          borrado: false, // Si `borrado` existe y se usa en la lógica
        },
      });

      if (!existente) {
        await prisma.parroquia.create({ data: parroquia });
      } else {
        await prisma.parroquia.update({
          where: { id: existente.id },
          data: parroquia, // Puedes modificarlo según tu lógica
        });
      }
    }

    return generarRespuesta("ok", "Parroquias creadas o actualizadas correctamente.", {}, 201);
  } catch (error) {
    console.error("Error al guardar parroquias:", error);
    return generarRespuesta("error", "Error interno al guardar parroquias.", {}, 500);
  }
}