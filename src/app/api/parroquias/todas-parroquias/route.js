import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarConsultarTodasParroquias from "@/services/validarConsultarTodasParroquias";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodasParroquias();

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "INTENTO_FALLIDO_TODAS_PARROQUIAS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al consultar todas las parroquias",
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

    const todasParroquias = await prisma.parroquia.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todasParroquias) {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "ERROR_GET_TODAS_PARROQUIAS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener todas las parroquias",
        datosAntes: null,
        datosDespues: null,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar parroquias...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "GET_TODAS_PARROQUIAS ",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron todas las parroquias",
        datosAntes: null,
        datosDespues: todasParroquias,
      });

      return generarRespuesta(
        "ok",
        "Todas las parroquias...",
        {
          parroquias: todasParroquias,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (parroquias): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "ERROR_INTERNO_TODAS_PARROQUIAS ",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar todas las parroquias",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno consultar (parroquias)",
      {},
      500
    );
  }
}
