import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearParroquia from "@/services/validarCrearParroquia";

export async function POST(request) {
  try {
    const { nombre } = await request.json();

    const validaciones = await validarCrearParroquia(nombre);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
       400
      );
    }

    const nuevaParroquia = await prisma.parroquia.create({
      data: {
        nombre: validaciones.nombre,
        id_usuario: validaciones.id_usuario,
        borrado: false
      },
    });

    if (!nuevaParroquia) {
      return generarRespuesta(
        "error",
        "Error, no se creo la parroquia",
        {},
        400
      );
    } else {
      return generarRespuesta("ok", "Parroquia creada...", {
        parroquia: nuevaParroquia
      }, 201);
    }
  } catch (error) {
    console.log(`Error interno (parroquias): ` + error);

    return generarRespuesta("error", "Error, interno (parroquias)", {}, 500);
  }
}
