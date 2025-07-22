import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCambiarAlDepartamento from "@/services/validarCambiarAlDepartamento";

export async function PATCH(request) {
  try {
    const { idDepartamento, idUsuario } = await request.json();

    const validaciones = await validarCambiarAlDepartamento(
      idDepartamento,
      idUsuario
    );

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const [cambiadoALDepartamento, usuarioActualizado] =
      await prisma.$transaction([
        // Primero se actualiza el usuario con solo el nuevo departamento
        prisma.usuario.update({
          where: { id: validaciones.id_usuario_miembro },
          data: {
            MiembrosDepartamentos: {
              set: [{ id: validaciones.id_departamento }],
            },
          },
        }),

        // Luego se consulta al usuario ya actualizado
        prisma.usuario.findFirst({
          where: {
            id: validaciones.id_usuario_miembro,
            borrado: false,
          },
          orderBy: { nombre: "asc" },
          include: { MiembrosDepartamentos: true },
        }),
      ]);

    // Validación de los resultados después de la transacción
    if (!cambiadoALDepartamento) {
      return generarRespuesta(
        "error",
        "Error, al cambiar de departamento...",
        {},
        400
      );
    }

    if (!usuarioActualizado) {
      return generarRespuesta(
        "error",
        "Error, al cambiar de departamento...",
        {},
        404
      );
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
    console.log(`Error interno (cambiar al departamento): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno (cambiar al departamento)",
      {},
      500
    );
  }
}
