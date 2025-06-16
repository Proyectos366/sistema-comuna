import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const modulos = [
      { nombre: "modulo i", id_usuario: 1, borrado: false },
      { nombre: "modulo ii", id_usuario: 1, borrado: false },
      { nombre: "modulo iii", id_usuario: 1, borrado: false },
      { nombre: "modulo iv", id_usuario: 1, borrado: false },
      { nombre: "modulo v", id_usuario: 1, borrado: false },
      { nombre: "modulo vi", id_usuario: 1, borrado: false },
      { nombre: "modulo vii", id_usuario: 1, borrado: false },
      { nombre: "modulo viii", id_usuario: 1, borrado: false },
      { nombre: "modulo ix", id_usuario: 1, borrado: false },
    ];

    for (const modulo of modulos) {
      const existente = await prisma.modulo.upsert({
        where: {
          nombre: modulo.nombre,
          id_usuario: modulo.id_usuario,
          borrado: false,
        },
        update: {}, // Aquí puedes especificar los valores a actualizar si el registro existe
        create: {
          nombre: modulo.nombre,
          id_usuario: modulo.id_usuario,
          borrado: false,
        }, // Aquí se definen los valores para crear el registro si no existe
      });

      if (!existente) {
        await prisma.modulo.create({ data: modulo });
      } else {
        await prisma.modulo.update({
          where: { id: existente.id },
          data: modulo, // Puedes modificarlo según tu lógica
        });
      }
    }
    return generarRespuesta("ok", "Modulos creados correctamente.", {}, 201);
  } catch (error) {
    console.error("Error al guardar modulos:", error);
    return generarRespuesta(
      "error",
      "Error interno al guardar modulos.",
      {},
      500
    );
  }
}
