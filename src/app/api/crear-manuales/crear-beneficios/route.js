import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const beneficios = [
      {
        nombre: "beneficio uno",
        id_usuario: 1,
        descripcion: "sin descripcion",
        borrado: false,
      },
      {
        nombre: "beneficio dos",
        id_usuario: 1,
        descripcion: "sin descripcion",
        borrado: false,
      },
      {
        nombre: "beneficio tres",
        id_usuario: 1,
        descripcion: "sin descripcion",
        borrado: false,
      },
    ];

    for (const beneficio of beneficios) {
      const existente = await prisma.beneficio.upsert({
        where: {
          nombre: beneficio.nombre,
          id_usuario: beneficio.id_usuario,
          descripcion: beneficio.descripcion,
          borrado: false,
        },
        update: {}, // Aquí puedes especificar los valores a actualizar si el registro existe
        create: {
          nombre: beneficio.nombre,
          id_usuario: beneficio.id_usuario,
          descripcion: beneficio.descripcion,
          borrado: false,
        }, // Aquí se definen los valores para crear el registro si no existe
      });

      if (!existente) {
        await prisma.beneficio.create({ data: beneficio });
      } else {
        await prisma.beneficio.update({
          where: { id: existente.id },
          data: beneficio, // Puedes modificarlo según tu lógica
        });
      }
    }
    return generarRespuesta("ok", "Beneficios creados correctamente.", {}, 201);
  } catch (error) {
    console.log("Error, al crear beneficios: " + error);
    return generarRespuesta(
      "error",
      "Error interno al crear beneficios.",
      {},
      500
    );
  }
}
