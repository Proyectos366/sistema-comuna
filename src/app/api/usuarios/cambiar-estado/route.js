import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCambiarEstado from "@/services/validarCambiarEstado";

export async function PATCH(request) {
  try {
    const { estado, idUsuario } = await request.json();

    const validaciones = await validarCambiarEstado(estado, idUsuario);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const [cambiandoEstado, usuarioActualizado] = await prisma.$transaction([
      // Primero se actualiza el usuario con solo el nuevo departamento
      prisma.usuario.update({
        where: { id: validaciones.id_usuario_estado },
        data: {
          borrado: validaciones.borrado, // Asegúrate que este sea el nuevo rol
        },
      }),

      // Luego se consulta al usuario ya actualizado
      prisma.usuario.findFirst({
        where: {
          id: validaciones.id_usuario_estado,
        },
        orderBy: { nombre: "asc" },
        include: { MiembrosDepartamentos: true },
      }),
    ]);

    // Validación de los resultados después de la transacción
    if (!cambiandoEstado) {
      return generarRespuesta("error", "Error, al cambiar estado...", {}, 400);
    }

    if (!usuarioActualizado) {
      return generarRespuesta("error", "Error, al cambiar estado...", {}, 404);
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
    console.log(`Error interno (cambiar estado): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno (cambiar estado)",
      {},
      500
    );
  }
}
