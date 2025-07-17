import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const todosRoles = await prisma.role.findMany({
      where: {
        borrado: false,
        NOT: {
          id: 1,
        },
      },
    });

    if (!todosRoles) {
      return generarRespuesta("error", "Error, al consultar roles...", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Todos los roles...",
        {
          roles: todosRoles,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (roles): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (roles)",
      {},
      500
    );
  }
}
