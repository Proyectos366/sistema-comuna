import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodosUsuariosNombres from "@/services/usuarios/validarConsultarTodosUsuariosNombres";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodosUsuariosNombres();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todosUsuarios = await prisma.usuario.findMany({
      where: {
        correo: {
          not: {
            in: [validaciones.correo, "carlosjperazab@gmail.com"],
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
      include: {
        MiembrosDepartamentos: true,
      },
    });

    if (!todosUsuarios) {
      return generarRespuesta("error", "Error, no hay usuarios", {}, 404);
    } else {
      return generarRespuesta(
        "error",
        "Usuarios encontrados",
        { usuarios: todosUsuarios },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno, todos usuarios nombres: ` + error);

    return generarRespuesta(
      "error",
      "Error interno, todos usuarios nombres",
      {},
      500
    );
  }
}
