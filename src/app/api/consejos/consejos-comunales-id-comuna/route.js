import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarConsejoIdComuna from "@/services/validarConsultarConsejosIdComuna";
import registrarEventoSeguro from "@/libs/trigget";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarConsejoIdComuna(request);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "INTENTO_FALLIDO_CONSEJOS_ID_COMUNA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion:
          "Validacion fallida al consultar consejos comunales por id comuna",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    // Consultar los consejos comunales de la comuna específica
    const consejosComunales = await prisma.consejo.findMany({
      where: { id_comuna: validaciones.id_comuna, borrado: false },
    });

    if (!consejosComunales) {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_GET_CONSEJOS_ID_COMUNA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener consejos comunales por id comuna",
        datosAntes: null,
        datosDespues: consejosComunales,
      });

      return generarRespuesta(
        "ok",
        "No hay consejos comunales en esta comuna.",
        { consejos: [] },
        200
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "GET_CONSEJOS_ID_COMUNA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron los consejos comunales por id comuna",
        datosAntes: null,
        datosDespues: consejosComunales,
      });

      return generarRespuesta(
        "ok",
        "Consejos comunales encontrados.",
        { consejos: consejosComunales },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno al consultar consejos comunales: ${error}`);

    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "ERROR_INTERNO_CONSEJOS_ID_COMUNA ",
      id_objeto: 0,
      id_usuario: 0,
      descripcion:
        "Error inesperado al consultar consejos comunales por id comuna",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error interno al consultar consejos comunales.",
      {},
      500
    );
  }
}
