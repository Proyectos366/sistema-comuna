import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarCrearInstitucion from "@/services/instituciones/validarCrearInstitucion";

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
    } = await request.json();

    const validaciones = await validarCrearInstitucion(
      nombre,
      descripcion,
      rif,
      sector,
      direccion,
      id_pais,
      id_estado,
      id_municipio
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "INTENTO_FALLIDO_INSTITUCION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear institucion",
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

    const nuevaInstitucion = await prisma.institucion.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        rif: validaciones.rif,
        sector: validaciones.sector,
        direccion: validaciones.direccion,
        id_pais: validaciones.id_pais,
        id_estado: validaciones.id_estado,
        id_municipio: validaciones.id_municipio,
        id_usuario: validaciones.id_usuario,
      },
    });

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

    if (!nuevaInstitucion) {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "ERROR_CREAR_INSTITUCION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear la institucion",
        datosAntes: null,
        datosDespues: nuevaInstitucion,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo la institucion",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "CREAR_INSTITUCION",
        id_objeto: nuevaInstitucion.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Institucion creada con exito",
        datosAntes: null,
        datosDespues: nuevaInstitucion,
      });

      return generarRespuesta(
        "ok",
        "Institución creada...",
        {
          instituciones: nuevaInstitucion,
          paises: todosPaises,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (institucion): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "institucion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear institucion",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (institucion)", {}, 500);
  }
}
