import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearCargo from "@/services/validarCrearCargo";

export async function POST(request) {
  try {
    const { nombre } = await request.json();

    const validaciones = await validarCrearCargo(nombre);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
       400
      );
    }

    const nuevoCargo = await prisma.cargo.create({
      data: {
        nombre: validaciones.nombre,
        id_usuario: validaciones.id_usuario,
      },
    });

    if (!nuevoCargo) {
      return generarRespuesta(
        "error",
        "Error, no se creo el cargo",
        {},
        400
      );
    } else {
      return generarRespuesta("ok", "Cargo creado...", {
        cargo: nuevoCargo
      }, 201);
    }
  } catch (error) {
    console.log(`Error interno (cargos): ` + error);

    return generarRespuesta("error", "Error, interno (cargos)", {}, 500);
  }
}
