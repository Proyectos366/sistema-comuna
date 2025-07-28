import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodasComunas from "@/services/validarConsultarTodasComunas";
import registrarEventoSeguro from "@/libs/trigget";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodasComunas();

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "INTENTO_FALLIDO_TODAS_COMUNAS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al consultar todas las comunas",
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

    const todasComunas = await prisma.comuna.findMany({
      where: {
        borrado: false,
      },
    });

    if (!todasComunas) {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "ERROR_GET_TODAS_COMUNAS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener todas las comunas",
        datosAntes: null,
        datosDespues: null,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar comunas...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "GET_TODAS_COMUNAS ",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron todas las comunas",
        datosAntes: null,
        datosDespues: {
          todasComunas,
        },
      });

      return generarRespuesta(
        "ok",
        "Todas las comunas...",
        {
          comunas: todasComunas,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (comunas): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "comuna",
      accion: "ERROR_INTERNO_TODAS_COMUNAS ",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar todos los cargos",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno consultar (comunas)",
      {},
      500
    );
  }
}
