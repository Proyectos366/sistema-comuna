import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarConsultarTodosConsejosComunales from "@/services/validarConsultarTodosConsejos";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodosConsejosComunales();

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "INTENTO_FALLIDO_TODOS_CONSEJOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al consultar todos los consejos comunales",
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

    const todosConsejosComunales = await prisma.consejo.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todosConsejosComunales) {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_GET_TODOS_CONSEJOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener todos los consejos comunales",
        datosAntes: null,
        datosDespues: todosConsejosComunales,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar consejos comunales...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "GET_TODOS_CONSEJOS ",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron todos los consejos comunales",
        datosAntes: null,
        datosDespues: todosConsejosComunales,
      });

      return generarRespuesta(
        "ok",
        "Todos los consejos comunales...",
        {
          consejos: todosConsejosComunales,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (consejos comunales): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "ERROR_INTERNO_TODOS_CONSEJOS ",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar todos los consejos comunales",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno consultar (consejos comunales)",
      {},
      500
    );
  }
}
