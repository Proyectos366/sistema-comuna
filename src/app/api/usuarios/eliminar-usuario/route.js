import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarEliminarUsuario from "@/services/validarEliminarUsuario";
import registrarEventoSeguro from "@/libs/trigget";

export async function PATCH(request) {
  try {
    const { estado, idUsuario } = await request.json();

    const validaciones = await validarEliminarUsuario(estado, idUsuario);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_DELETE",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al eliminar usuario",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const [eliminandoUsuario, usuarioActualizado] = await prisma.$transaction([
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
    if (!eliminandoUsuario || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_DELETE_USUARIO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo eliminar el usuario",
        datosAntes: null,
        datosDespues: {
          eliminandoUsuario,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al eliminar usuario...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "DELETE_USUARIO",
        id_objeto: usuarioActualizado.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Usuario eliminado con exito",
        datosAntes: null,
        datosDespues: {
          eliminandoUsuario,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "ok",
        "Usuario eliminado correctamente...",
        {
          usuario: usuarioActualizado,
        },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno (eliminar usuario): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_DELETE",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al eliminar usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (eliminar usuario)",
      {},
      500
    );
  }
}
