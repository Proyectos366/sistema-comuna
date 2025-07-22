import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCambiarRol from "@/services/validarCambiarRol";

export async function PATCH(request) {
  try {
    const { idRol, idUsuario } = await request.json();

    const validaciones = await validarCambiarRol(idRol, idUsuario);

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const [cambiadoRol, usuarioActualizado] = await prisma.$transaction([
      // Primero se actualiza el usuario con solo el nuevo departamento
      prisma.usuario.update({
        where: { id: validaciones.id_usuario_rol },
        data: {
          id_rol: validaciones.id_rol, // Asegúrate que este sea el nuevo rol
        },
      }),

      // Luego se consulta al usuario ya actualizado
      prisma.usuario.findFirst({
        where: {
          id: validaciones.id_usuario_rol,
          borrado: false,
        },
        orderBy: { nombre: "asc" },
        include: { MiembrosDepartamentos: true },
      }),
    ]);

    // Validación de los resultados después de la transacción
    if (!cambiadoRol) {
      return generarRespuesta("error", "Error, al cambiar de rol...", {}, 400);
    }

    if (!usuarioActualizado) {
      return generarRespuesta("error", "Error, al cambiar de rol...", {}, 404);
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
    console.log(`Error interno (cambiar de rol): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno (cambiar de rol)",
      {},
      500
    );
  }
}
