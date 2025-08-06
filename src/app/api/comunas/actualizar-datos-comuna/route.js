import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarComuna from "@/services/comunas/validarEditarComuna";

export async function POST(request) {
  try {
    const { nombre, id_parroquia, id_comuna } = await request.json();

    const validaciones = await validarEditarComuna(
      nombre,
      id_parroquia,
      id_comuna
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar comuna",
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

    const [actualizada, comunaActualizada] = await prisma.$transaction([
      prisma.comuna.update({
        where: { id: validaciones.id_comuna },
        data: {
          nombre: validaciones.nombre,
          id_parroquia: validaciones.id_parroquia,
        },
      }),

      prisma.comuna.findMany({
        where: {
          id: validaciones.id_comuna,
          borrado: false,
        },
      }),
    ]);

    if (!comunaActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "ERROR_UPDATE_COMUNA",
        id_objeto: validaciones.id_comuna,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la comuna",
        datosAntes: { nombre, id_parroquia, id_comuna },
        datosDespues: actualizada,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar comuna actualizada",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "UPDATE_COMUNA",
        id_objeto: comunaActualizada[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Comuna actualizada con exito id: ${validaciones.id_comuna}`,
        datosAntes: {
          nombre: nombre,
          id_comuna: id_comuna,
          id_parroquia: id_parroquia,
        },
        datosDespues: comunaActualizada,
      });

      return generarRespuesta(
        "ok",
        "Comuna actualizada...",
        { comuna: comunaActualizada[0] },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar comuna): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "comuna",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la comuna",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar comuna)",
      {},
      500
    );
  }
}
