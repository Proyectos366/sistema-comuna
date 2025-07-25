import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarConsultarTodosCargos from "@/services/validarConsultarTodosCargos";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodosCargos();

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "INTENTO_FALLIDO_TODOS_CARGOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al consultar todos los cargos",
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

    const todosCargos = await prisma.cargo.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todosCargos) {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "ERROR_GET_TODOS_CARGOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener todos los cargos",
        datosAntes: null,
        datosDespues: null,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar cargos...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "GET_TODOS_CARGOS ",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron todos los cargos",
        datosAntes: null,
        datosDespues: {
          todosCargos,
        },
      });

      return generarRespuesta(
        "ok",
        "Todas los cargos...",
        {
          cargos: todosCargos,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (cargos): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "cargo",
      accion: "ERROR_INTERNO_TODOS_CARGOS ",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar todos los cargos",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno consultar (cargos)",
      {},
      500
    );
  }
}
