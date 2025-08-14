import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarMunicipio from "@/services/municipios/validarEditarMunicipio";

export async function POST(request) {
  try {
    const { nombre, descripcion, id_pais, id_estado, id_municipio } =
      await request.json();

    const validaciones = await validarEditarMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "INTENTO_FALLIDO_MUNICIPIO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar el municipio",
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

    const [actualizado, municipioActualizado] = await prisma.$transaction([
      prisma.municipio.update({
        where: { id: validaciones.id_municipio },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.municipio.findFirst({
        where: {
          id: validaciones.id_municipio,
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

    if (!municipioActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "ERROR_UPDATE_MUNICIPIO",
        id_objeto: validaciones.id_municipio,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el municipio",
        datosAntes: { nombre, descripcion, id_pais, id_estado, id_municipio },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, no se actualizado el municipio",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "UPDATE_MUNICIPIO",
        id_objeto: municipioActualizado?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Municipio actualizado con exito id: ${validaciones.id_municipio}`,
        datosAntes: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          id_pais: validaciones.id_pais,
          id_estado: validaciones.id_estado,
          id_municipio: validaciones.id_municipio,
        },
        datosDespues: municipioActualizado,
      });

      return generarRespuesta(
        "ok",
        "Municipio actualizado...",
        { municipios: municipioActualizado, paises: todosPaises },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar municipio): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "municipio",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el municipio",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar municipio)",
      {},
      500
    );
  }
}
