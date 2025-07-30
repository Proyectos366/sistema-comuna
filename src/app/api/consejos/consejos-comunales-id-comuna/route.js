import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarConsejoIdComuna from "@/services/validarConsultarConsejosIdComuna";
import registrarEventoSeguro from "@/libs/trigget";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarConsejoIdComuna(request);

    if (validaciones.status === "error") {
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
      return generarRespuesta(
        "ok",
        "No hay consejos comunales en esta comuna.",
        { consejos: [] },
        200
      );
    } else {
      return generarRespuesta(
        "ok",
        "Consejos comunales encontrados.",
        { consejos: consejosComunales },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno al consultar consejos comunales: ${error}`);

    return generarRespuesta(
      "error",
      "Error interno al consultar consejos comunales.",
      {},
      500
    );
  }
}
