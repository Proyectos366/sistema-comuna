import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarComunasIdParroquia from "@/services/validarConsultarComunasIdParroquia";
import registrarEventoSeguro from "@/libs/trigget";

export async function GET(request) {
  try {
    const validaciones = await validarConsultarComunasIdParroquia(request);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "INTENTO_FALLIDO_COMUNAS_ID_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al consultar comunas por id parroquia",
        datosAntes: null,
        datosDespues: validaciones,
      });

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
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "ERROR_GET_COMUNAS_ID_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo obtener comunas por id parroquia",
        datosAntes: null,
        datosDespues: comunasIdParroquia,
      });

      return generarRespuesta(
        "ok",
        "No hay comunas en esta parroquia.",
        { comunas: [] },
        200
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "GET_COMUNAS_ID_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Se obtuvieron las comunas por id parroquia",
        datosAntes: null,
        datosDespues: comunasIdParroquia,
      });

      return generarRespuesta(
        "ok",
        "Comunas encontradas.",
        { comunas: comunasIdParroquia },
        200
      );
    }
  } catch (error) {
    console.log(`Error interno al consultar comunas: ${error}`);

    await registrarEventoSeguro(request, {
      tabla: "comuna",
      accion: "ERROR_INTERNO_COMUNAS_ID_PARROQUIA ",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al consultar comunas por id parroquia",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error interno al consultar comunas.",
      {},
      500
    );
  }
}
