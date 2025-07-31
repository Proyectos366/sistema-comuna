import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarConsejoComunal from "@/services/validarEditarConsejoComunal";

export async function POST(request) {
  try {
    const { nombre, id_comuna, id_consejo } = await request.json();

    const validaciones = await validarEditarConsejoComunal(
      nombre,
      id_comuna,
      id_consejo
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar consejo comunal",
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

    const [actualizado, consejoComunalActualizado] = await prisma.$transaction([
      prisma.consejo.update({
        where: { id: validaciones.id_consejo },
        data: {
          nombre: validaciones.nombre,
          id_comuna: validaciones.id_comuna,
        },
      }),

      prisma.consejo.findMany({
        where: {
          id: validaciones.id_consejo,
          borrado: false,
        },
      }),
    ]);

    if (!consejoComunalActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_UPDATE_CONSEJO_COMUNAL",
        id_objeto: validaciones.id_consejo,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el consejo comunal",
        datosAntes: { nombre, id_comuna, id_consejo },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar consejo actualizado",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "UPDATE_CONSEJO_COMUNAL",
        id_objeto: consejoComunalActualizado[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Consejo comunal actualizado con exito id: ${validaciones.id_consejo}`,
        datosAntes: {
          nombre: nombre,
          id_comuna: id_comuna,
          id_consejo: id_consejo,
        },
        datosDespues: consejoComunalActualizado,
      });

      return generarRespuesta(
        "ok",
        "Consejo comunal actualizado...",
        { consejo: consejoComunalActualizado[0] },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar consejo): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el consejo comunal",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar consejo)",
      {},
      500
    );
  }
}
