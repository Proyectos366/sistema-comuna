import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarFormacion from "@/services/validarEditarFormacion";

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
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar la formación",
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

    const [actualizada, formacionActualizada] = await prisma.$transaction([
      prisma.formacion.update({
        where: { id: validaciones.id_formacion },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.formacion.findMany({
        where: {
          id: validaciones.id_formacion,
          borrado: false,
        },
      }),
    ]);

    if (!formacionActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_UPDATE_FORMACION",
        id_objeto: validaciones.id_formacion,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la formacion",
        datosAntes: { nombre, descripcion, id_formacion },
        datosDespues: actualizada,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar la formación actualizada",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "UPDATE_FORMACION",
        id_objeto: formacionActualizada[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Formacion actualizada con exito id: ${validaciones.id_formacion}`,
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          id_formacion: id_formacion,
        },
        datosDespues: formacionActualizada,
      });

      return generarRespuesta(
        "ok",
        "Formación actualizada...",
        { formacion: formacionActualizada[0] },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar formacion): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la formacion",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar formacion)",
      {},
      500
    );
  }
}
