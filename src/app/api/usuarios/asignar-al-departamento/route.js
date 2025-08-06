import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarAsignarAlDepartamento from "@/services/usuarios/validarAsignarAlDepartamento";
import registrarEventoSeguro from "@/libs/trigget";

export async function PATCH(request) {
  try {
    const { idDepartamento, idUsuario } = await request.json();

    const validaciones = await validarAsignarAlDepartamento(
      idDepartamento,
      idUsuario
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_ASIGNAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al intentar asignar un usuario a un departamento",
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

    const [asignadoALDepartamento, usuarioActualizado] =
      await prisma.$transaction([
        prisma.departamento.update({
          where: { id: validaciones.id_departamento },
          data: {
            miembros: {
              connect: { id: validaciones.id_usuario_miembro },
            },
          },
        }),

        prisma.usuario.findUnique({
          where: { id: validaciones.id_usuario_miembro },
          include: { MiembrosDepartamentos: true },
        }),
      ]);

    if (!usuarioActualizado || !asignadoALDepartamento) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_ASIGNAR_DEPARTAMENTO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo asignar al departamento",
        datosAntes: null,
        datosDespues: usuarioActualizado,
      });

      return generarRespuesta(
        "error",
        "No se pudo asignar al departamento",
        {},
        !asignadoALDepartamento ? 400 : 404
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "UPDATE_ASIGNAR_DEPARTAMENTO",
        id_objeto: usuarioActualizado?.MiembrosDepartamentos?.[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Usuario asignado con exito al departamento ${usuarioActualizado?.MiembrosDepartamentos?.[0]?.nombre}`,
        datosAntes: null,
        datosDespues: usuarioActualizado,
      });

      return generarRespuesta(
        "ok",
        "Se asigno con exito al departamento",
        { usuario: usuarioActualizado },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno (asignar al departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_ASIGNAR_DEPARTAMENTO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al asignar un usuario a un departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (asignar al departamento)",
      {},
      500
    );
  }
}
