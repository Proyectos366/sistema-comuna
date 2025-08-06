import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarComunasIdParroquia from "@/services/comunas/validarConsultarComunasIdParroquia";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarComunasIdParroquia(request);

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const comunasIdParroquia = await prisma.comuna.findMany({
      where: { id_parroquia: validaciones.id_parroquia, borrado: false },
      include: {
        voceros: {
          select: {
            id: true,
            nombre: true,
            nombre_dos: true,
            apellido: true,
            apellido_dos: true,
            cedula: true,
            telefono: true,
            correo: true,
            edad: true,
            genero: true,
          },
        },
      },
    });

    if (!comunasIdParroquia) {
      return generarRespuesta(
        "ok",
        "No hay comunas en esta parroquia.",
        { comunas: [] },
        200
      );
    } else {
      return generarRespuesta(
        "ok",
        "Comunas encontradas.",
        { comunas: comunasIdParroquia },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno al consultar comunas: ${error}`);

    return generarRespuesta(
      "error",
      "Error interno al consultar comunas.",
      {},
      500
    );
  }
}
