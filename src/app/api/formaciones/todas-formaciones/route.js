import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarConsultarTodasFormaciones from "@/services/validarConsultarTodasFormaciones";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarTodasFormaciones();

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "INTENTO_FALLIDO_TODAS_FORMACIONES",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al consultar todas las formaciones",
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

    const todasFormaciones = await prisma.formacion.findMany({
      where: {
        borrado: false,
        culminada: false,
      },
    });

    if (!todasFormaciones) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_GET_TODAS_FORMACIONES",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener todas las formaciones",
        datosAntes: null,
        datosDespues: null,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar formaciones...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "GET_TODAS_FORMACIONES ",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron todas las formaciones",
        datosAntes: null,
        datosDespues: {
          todasFormaciones,
        },
      });

      return generarRespuesta(
        "ok",
        "Todas las formaciones...",
        {
          formaciones: todasFormaciones,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (formaciones): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO_TODAS_FORMACIONES ",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar todas las formaciones",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno consultar (formaciones)",
      {},
      500
    );
  }
}
