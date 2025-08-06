import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCambiarRol from "@/services/usuarios/validarCambiarRol";
import registrarEventoSeguro from "@/libs/trigget";

export async function PATCH(request) {
  try {
    const { idRol, idUsuario } = await request.json();

    const validaciones = await validarCambiarRol(idRol, idUsuario);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_CAMBIAR_ROL",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al cambiar rol al usuario",
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
        },
        orderBy: { nombre: "asc" },
        include: { MiembrosDepartamentos: true },
      }),
    ]);

    // Validación de los resultados después de la transacción
    if (!cambiadoRol || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_CAMBIAR_ROL",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo cambiar el rol al usuario",
        datosAntes: null,
        datosDespues: {
          cambiadoRol,
          usuarioActualizado,
        },
      });

      return generarRespuesta("error", "Error, al cambiar de rol...", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "UPDATE_CAMBIAR_ROL",
        id_objeto: usuarioActualizado.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Rol cambiado con exito",
        datosAntes: null,
        datosDespues: {
          cambiadoRol,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "ok",
        "Cambio exitoso...",
        {
          usuario: usuarioActualizado,
        },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno (cambiar de rol): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_CAMBIAR_ROL",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al cambiar rol de usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (cambiar de rol)",
      {},
      500
    );
  }
}
