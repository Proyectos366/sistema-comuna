import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarParroquia from "@/services/parroquias/validarEditarParroquia";

export async function POST(request) {
  try {
    const {
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia,
    } = await request.json();

    const validaciones = await validarEditarParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio,
      id_parroquia
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "INTENTO_FALLIDO_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar la parroquia",
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

    const [actualizado, parroquiaActualizada] = await prisma.$transaction([
      prisma.parroquia.update({
        where: { id: validaciones.id_parroquia },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.parroquia.findFirst({
        where: {
          id: validaciones.id_parroquia,
          borrado: false,
        },
      }),
    ]);

    const todosPaises = await prisma.pais.findMany({
      where: {
        borrado: false,
      },
      include: {
        estados: {
          include: {
            municipios: {
              include: {
                parroquias: true,
              },
            },
          },
        },
      },
    });

    if (!parroquiaActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "ERROR_UPDATE_PARROQUIA",
        id_objeto: validaciones.id_parroquia,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la parroquia",
        datosAntes: {
          nombre,
          descripcion,
          id_pais,
          id_estado,
          id_municipio,
          id_parroquia,
        },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, no se actualizado la parroquia",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "UPDATE_PARROQUIA",
        id_objeto: parroquiaActualizada?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Parroquia actualizada con exito id: ${validaciones.id_parroquia}`,
        datosAntes: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          id_pais: validaciones.id_pais,
          id_estado: validaciones.id_estado,
          id_municipio: validaciones.id_municipio,
          id_parroquia: validaciones.id_parroquia,
        },
        datosDespues: parroquiaActualizada,
      });

      return generarRespuesta(
        "ok",
        "Parroquia actualizada...",
        { parroquias: parroquiaActualizada, paises: todosPaises },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar parroquia): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la parroquia",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar parroquia)",
      {},
      500
    );
  }
}
