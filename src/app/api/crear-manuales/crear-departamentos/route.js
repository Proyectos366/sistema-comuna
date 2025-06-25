import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const departamentos = ["oac", "despacho", "informatica"].map((nombre) => ({
      nombre,
      descripcion: "sin descripcion",
      borrado: false,
      id_usuario: 1,
    }));

    for (const departamento of departamentos) {
      const existente = await prisma.departamento.findUnique({
        where: { nombre: departamento.nombre },
      });

      if (!existente) {
        await prisma.departamento.create({ data: departamento });
      } else {
        await prisma.departamento.update({
          where: { id: existente.id },
          data: departamento,
        });
      }
    }

    return generarRespuesta(
      "ok",
      "Departamentos creados o actualizados correctamente.",
      {},
      201
    );
  } catch (error) {
    console.log("Error, al guardar departamentos: " + error);
    return generarRespuesta(
      "error",
      "Error interno al guardar departamentos.",
      {},
      500
    );
  }
}
