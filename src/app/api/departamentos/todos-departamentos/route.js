import prisma from "@/libs/prisma";
import registrarEventoSeguro from "@/libs/trigget";
import validarConsultarTodosDepartamentos from "@/services/validarConsultarTodosDepartamentos";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodosDepartamentos();

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "INTENTO_FALLIDO_TODOS_DEPARTAMENTOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al consultar todos los departamentos",
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

    const todosDepartamentos = await prisma.departamento.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todosDepartamentos) {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "ERROR_GET_TODOS_DEPARTAMENTOS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener todos los departamentos",
        datosAntes: null,
        datosDespues: {
          todosDepartamentos,
        },
      });

      return generarRespuesta(
        "error",
        "Error, al consultar todos los departamentos...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "GET_TODOS_DEPARTAMENTOS ",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron todos los departamentos",
        datosAntes: null,
        datosDespues: {
          todosDepartamentos,
        },
      });

      return generarRespuesta(
        "ok",
        "Todas los departamentos...",
        {
          departamentos: todosDepartamentos,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (departamentos): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "ERROR_INTERNO_TODOS_DEPARTAMENTOS ",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar todos los departamentos",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno consultar (departamentos)",
      {},
      500
    );
  }
}
