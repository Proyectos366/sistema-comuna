import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearDepartamento from "@/services/validarCrearDepartamento";

export async function POST(request) {
  try {
    const { nombre, descripcion } = await request.json();

    const validaciones = await validarCrearDepartamento(nombre, descripcion);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const nuevoDepartamento = await prisma.departamento.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        id_usuario: validaciones.id_usuario,
      },
    });

    if (!nuevoDepartamento) {
      return generarRespuesta(
        "error",
        "Error, no se creo el departamento...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Departamento creado...",
        {
          departamento: nuevoDepartamento,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (departamento): ` + error);

    return generarRespuesta("error", "Error, interno (departamento)", {}, 500);
  }
}
