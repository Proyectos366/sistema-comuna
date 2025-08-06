import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCambiarAcceso from "@/services/usuarios/validarCambiarAcceso";
import registrarEventoSeguro from "@/libs/trigget";

export async function PATCH(request) {
  try {
    const { validado, idUsuario } = await request.json();

    const validaciones = await validarCambiarAcceso(validado, idUsuario);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_AUTORIZAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al autenticar usuario para inicio de sesion",
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

    if (!cambiandoAcceso || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: validaciones.validado
          ? "ERROR_UPDATE_AUTORIZADO"
          : "ERROR_UPDATE_RESTRINGIDO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: validaciones.validado
          ? "No se pudo autorizar el usuario para inicio de sesion"
          : "No se pudo restringir el usuario para inicio de sesion",
        datosAntes: null,
        datosDespues: {
          cambiandoAcceso,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al cambiar acceso...",
        {},
        !cambiandoAcceso ? 400 : 404
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: validaciones.validado
          ? "UPDATE_AUTORIZADO"
          : "UPDATE_RESTRINGIDO",
        id_objeto: usuarioActualizado.id,
        id_usuario: validaciones.id_usuario,
        descripcion: validaciones.validado
          ? "Usuario se autorizo para inicio de sesion"
          : "Usuario se restringio para inicio de sesion",
        datosAntes: null,
        datosDespues: {
          cambiandoAcceso,
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
    console.log(`Error interno (cambiar acceso): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_AUTORIZAR",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al autorizar usuario",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (cambiar acceso)",
      {},
      500
    );
  }
}
