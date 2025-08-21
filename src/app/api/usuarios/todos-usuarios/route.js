import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodosUsuarios from "@/services/usuarios/validarConsultarTodosUsuarios";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodosUsuarios();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    const todosUsuarios = await prisma.usuario.findMany({
      where: {
        correo: {
          not: {
            in: [validaciones.correo, "carlosjperazab@gmail.com"],
          },
        },
      },
      orderBy: {
        nombre: "asc",
      },
      select: {
        id: true,
        cedula: true,
        correo: true,
        nombre: true,
        apellido: true,
        borrado: true,
        validado: true,
        createdAt: true,
        id_rol: true,
        roles: {
          select: { id: true, nombre: true },
        },
        MiembrosDepartamentos: {
          select: { id: true, nombre: true, descripcion: true },
        },
      },
    });

    if (!todosUsuarios) {
      return generarRespuesta(
        "error",
        "Error, al consultar todos usuarios",
        {},
        404
      );
    } else {
      return generarRespuesta(
        "ok",
        "Usuarios encontrados",
        { usuarios: todosUsuarios },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno, todos usuarios: ` + error);

    return generarRespuesta("error", "Error interno todos usuarios", {}, 500);
  }
}
