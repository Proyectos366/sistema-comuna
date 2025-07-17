import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const formaciones = [
      {
        nombre: "participación popular y contraloria social",
        id_usuario: 1,
        culminada: false,
        borrado: false,
      },
    ];

    for (const formacione of formaciones) {
      const existente = await prisma.formacion.upsert({
        where: {
          nombre: formacione.nombre,
          id_usuario: formacione.id_usuario,
          borrado: formacione.borrado,
          culminada: formacione.culminada,
        },
        update: {}, // Aquí puedes especificar los valores a actualizar si el registro existe
        create: {
          nombre: formacione.nombre,
          id_usuario: formacione.id_usuario,
          borrado: formacione.borrado,
          culminada: formacione.culminada,
        }, // Aquí se definen los valores para crear el registro si no existe
      });

      if (!existente) {
        await prisma.formacion.create({ data: formacione });
      } else {
        await prisma.formacion.update({
          where: { id: existente.id },
          data: formacione, // Puedes modificarlo según tu lógica
        });
      }
    }
    return generarRespuesta(
      "ok",
      "Formaciones creados correctamente.",
      {},
      201
    );
  } catch (error) {
    console.error("Error al guardar formaciones:", error);
    return generarRespuesta(
      "error",
      "Error interno al guardar formaciones.",
      {},
      500
    );
  }
}
