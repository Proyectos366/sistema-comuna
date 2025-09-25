import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const cargos = [
      {
        nombre: "unidad ejecutiva",
        id_usuario: 1,
        descripcion:
          "encargada de implementar y ejecutar tareas específicas que forman parte de un plan o proyecto más amplio, transformando el presupuesto en bienes y servicios o gestionando fondos",
        borrado: false,
      },
      {
        nombre: "unidad financiera",
        id_usuario: 1,
        descripcion: "encargada de manejar los recursos que se han obtenido",
        borrado: false,
      },
      {
        nombre: "contraloria social",
        id_usuario: 1,
        descripcion: "encargado de controlar los recursos publicos",
        borrado: false,
      },
    ];

    for (const cargo of cargos) {
      const existente = await prisma.cargo.upsert({
        where: {
          nombre: cargo.nombre,
          id_usuario: cargo.id_usuario,
          descripcion: cargo.descripcion,
          borrado: false,
        },
        update: {}, // Aquí puedes especificar los valores a actualizar si el registro existe
        create: {
          nombre: cargo.nombre,
          id_usuario: cargo.id_usuario,
          descripcion: cargo.descripcion,
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
