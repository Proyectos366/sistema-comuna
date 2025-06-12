import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearModulo from "@/services/validarCrearModulo";

export async function POST(request) {
  try {
    const { nombre } = await request.json();

    const validaciones = await validarCrearModulo(nombre);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const nuevoModulo = await prisma.modulo.create({
      data: {
        nombre: validaciones.nombre,
        id_usuario: validaciones.id_usuario,
        borrado: false,
      },
    });

    if (!nuevoModulo) {
      return generarRespuesta("error", "Error, no se creo el modulo", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Modulo creado...",
        {
          modulo: nuevoModulo,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (modulos): ` + error);

    return generarRespuesta("error", "Error, interno (modulos)", {}, 500);
  }
}
