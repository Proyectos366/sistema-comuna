import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarInstitucion from "@/services/instituciones/validarEditarInstitucion";

export async function POST(request) {
  try {
    const {
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_institucion,
    } = await request.json();

    const validaciones = await validarEditarInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio,
      id_institucion
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "INTENTO_FALLIDO_INSTITUCION",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar la institución",
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

    const [actualizada, institucionActualizada] = await prisma.$transaction([
      prisma.institucion.update({
        where: { id: validaciones.id_institucion },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
          rif: validaciones.rif,
          sector: validaciones.sector,
          direccion: validaciones.direccion,
        },
      }),

      prisma.institucion.findMany({
        where: {
          id: validaciones.id_institucion,
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
                instituciones: true,
              },
            },
          },
        },
      },
    });

    if (!institucionActualizada) {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "ERROR_UPDATE_INSTITUCION",
        id_objeto: validaciones.id_institucion,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar la institución",
        datosAntes: {
          nombre,
          descripcion,
          rif,
          sector,
          direccion,
          id_institucion,
        },
        datosDespues: actualizada,
      });

      return generarRespuesta(
        "error",
        "Error, al actualizar institucion",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "UPDATE_INSTITUCION",
        id_objeto: institucionActualizada?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Institucion actualizada con exito id: ${validaciones.id_institucion}`,
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          rif: rif,
          sector: sector,
          direccion: direccion,
          id_institucion: id_institucion,
        },
        datosDespues: institucionActualizada,
      });

      return generarRespuesta(
        "ok",
        "Institución actualizada...",
        { instituciones: institucionActualizada[0], paises: todosPaises },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar institucion): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "institucion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar la institucion",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar institucion)",
      {},
      500
    );
  }
}
