import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarFormacion from "@/services/formaciones/validarEditarFormacion";

export async function POST(request) {
  try {
    const { nombre, descripcion, cantidadModulos, id_formacion } =
      await request.json();

    const validaciones = await validarEditarFormacion(
      nombre,
      cantidadModulos,
      descripcion,
      id_formacion
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario || 0,
        descripcion: "Validación fallida al intentar editar la formación",
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

    const formacionDespues = await prisma.formacion.findUnique({
      where: { id: validaciones.id_formacion, borrado: false },
      include: { modulos: true },
    });

    if (!formacionDespues) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_UPDATE_FORMACION",
        id_objeto: validaciones.id_formacion,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo consultar la formación actualizada",
        datosAntes: { nombre, descripcion, id_formacion },
        datosDespues: null,
      });
      return generarRespuesta(
        "error",
        "Error, no se actualizo la formación",
        {},
        400
      );
    }

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "UPDATE_FORMACION",
      id_objeto: formacionDespues.id,
      id_usuario: validaciones.id_usuario,
      descripcion: `Formación actualizada con éxito id: ${validaciones.id_formacion}`,
      datosAntes: { nombre, descripcion, id_formacion },
      datosDespues: formacionDespues,
    });

    return generarRespuesta(
      "ok",
      "Formación actualizada",
      { formacion: formacionDespues },
      201
    );
  } catch (error) {
    console.error("Error interno (actualizar formación):", error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la formación",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error interno al actualizar la formación",
      {},
      500
    );
  }
}
