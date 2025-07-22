import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCambiarAcceso from "@/services/validarCambiarAcceso";

export async function PATCH(request) {
  try {
    const { validado, idUsuario } = await request.json();

    const validaciones = await validarCambiarAcceso(validado, idUsuario);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const [cambiandoAcceso, usuarioActualizado] = await prisma.$transaction([
      // Primero se actualiza el usuario con solo el nuevo departamento
      prisma.usuario.update({
        where: { id: validaciones.id_usuario_validado },
        data: {
          validado: validaciones.validado, // Asegúrate que este sea el nuevo rol
        },
      }),

      // Luego se consulta al usuario ya actualizado
      prisma.usuario.findFirst({
        where: {
          id: validaciones.id_usuario_validado,
        },
        orderBy: { nombre: "asc" },
        include: { MiembrosDepartamentos: true },
      }),
    ]);

    if (!cambiandoAcceso) {
      return generarRespuesta("error", "Error, al cambiar acceso...", {}, 400);
    }

    if (!usuarioActualizado) {
      return generarRespuesta("error", "Error, al cambiar acceso...", {}, 404);
    }

    // Si todo salió bien, puedes continuar con lo siguiente
    return generarRespuesta(
      "ok",
      "Cambio exitoso...",
      {
        usuario: usuarioActualizado,
      },
      200
    );
  } catch (error) {
    console.log(`Error interno (cambiar acceso): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno (cambiar acceso)",
      {},
      500
    );
  }
}
