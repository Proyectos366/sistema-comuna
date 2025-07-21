import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarAsignarAlDepartamento from "@/services/validarAsignarAlDepartamento";

export async function PATCH(request) {
  try {
    const { idDepartamento, idUsuario } = await request.json();

    const validaciones = await validarAsignarAlDepartamento(
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

    /** 
      const asignadoALDepartamento = await prisma.departamento.update({
        where: { id: validaciones.id_departamento },
        data: {
          miembros: {
            connect: { id: validaciones.id_usuario_miembro },
          },
        },
      });

      const usuarioActualizado = await prisma.usuario.findFirst({
        where: {
          id: validaciones.id_usuario_miembro,
          borrado: false,
        },
        orderBy: {
          nombre: "asc",
        },
        include: {
          MiembrosDepartamentos: true,
        },
      });

      //const asignadoALDepartamento = false;
      if (!asignadoALDepartamento) {
        return generarRespuesta(
          "error",
          "Error, al asignar departamento",
          {},
          400
        );
      }

      return generarRespuesta(
        "ok",
        "Usuario se le asigno departamento...",
        { usuarios: asignadoALDepartamento },
        200
      );
    */

    const asignadoALDepartamento = await prisma.departamento.update({
      where: { id: validaciones.id_departamento },
      data: {
        miembros: {
          connect: { id: validaciones.id_usuario_miembro },
        },
      },
    });

    if (!asignadoALDepartamento) {
      return generarRespuesta(
        "error",
        "Error al asignar departamento",
        {},
        400
      );
    }

    const usuarioActualizado = await prisma.usuario.findFirst({
      where: {
        id: validaciones.id_usuario_miembro,
        borrado: false,
      },
      orderBy: { nombre: "asc" },
      include: { MiembrosDepartamentos: true },
    });

    if (!usuarioActualizado) {
      return generarRespuesta(
        "error",
        "No se pudo obtener el usuario actualizado",
        {},
        404
      );
    }

    return generarRespuesta(
      "ok",
      "Se asigno con exito al departamento",
      { usuario: usuarioActualizado },
      200
    );
  } catch (error) {
    console.log(`Error interno (asignar al departamento): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno (asignar al departamento)",
      {},
      500
    );
  }
}
