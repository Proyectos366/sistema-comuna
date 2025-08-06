import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCambiarAlDepartamento from "@/services/usuarios/validarCambiarAlDepartamento";
import registrarEventoSeguro from "@/libs/trigget";

export async function PATCH(request) {
  try {
    const { idDepartamento, idUsuario } = await request.json();

    const validaciones = await validarCambiarAlDepartamento(
      idDepartamento,
      idUsuario
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_CAMBIAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al cambiar un usuario de departamento",
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

    if (!cambiadoALDepartamento || !usuarioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_CAMBIAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo cambiar al usuario de departamento",
        datosAntes: null,
        datosDespues: {
          cambiadoALDepartamento,
          usuarioActualizado,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al cambiar de departamento...",
        {},
        !cambiadoALDepartamento ? 400 : 404
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "UPDATE_CAMBIAR_DEPARTAMENTO",
        id_objeto: usuarioActualizado?.MiembrosDepartamentos?.[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Usuario cambiado con exito al departamento ${usuarioActualizado?.MiembrosDepartamentos?.[0]?.nombre}`,
        datosAntes: null,
        datosDespues: {
          cambiadoALDepartamento,
          usuarioActualizado,
        },
      });

      // Si todo salió bien, puedes continuar con lo siguiente
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
    console.log(`Error interno (cambiar al departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_CAMBIAR_DEPARTAMENTO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al cambiar usuario de departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (cambiar al departamento)",
      {},
      500
    );
  }
}
