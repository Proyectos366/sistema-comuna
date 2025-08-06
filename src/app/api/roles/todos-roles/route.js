import prisma from "@/libs/prisma";
import validarConsultarTodosRoles from "@/services/roles/validarConsultarTodosRoles";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodosRoles();

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "rol",
        accion: "INTENTO_FALLIDO_TODOS_ROLES",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al consultar todos los roles",
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

    const todosRoles = await prisma.role.findMany({
      where: {
        borrado: false,
        NOT: {
          id: 1,
        },
      },
    });

    if (!todosRoles) {
      return generarRespuesta("error", "Error, al consultar roles...", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Todos los roles...",
        {
          roles: todosRoles,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (roles): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (roles)",
      {},
      500
    );
  }
}
