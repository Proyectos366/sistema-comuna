import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarCrearMunicipio from "@/services/municipios/validarCrearMunicipio";

export async function POST(request) {
  try {
    const { nombre, descripcion, id_pais, id_estado } = await request.json();

    const validaciones = await validarCrearMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "INTENTO_FALLIDO_MUNICIPIO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear el municipio",
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

    const nuevoMunicipio = await prisma.municipio.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        serial: validaciones.serial,
        id_usuario: validaciones.id_usuario,
        id_estado: validaciones.id_estado,
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
              },
            },
          },
        },
      },
    });

    if (!nuevoMunicipio) {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "ERROR_CREAR_MUNICIPIO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el municipio",
        datosAntes: null,
        datosDespues: nuevoMunicipio,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo el municipio",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "municipio",
        accion: "CREAR_MUNICIPIO",
        id_objeto: nuevoMunicipio.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Municipio creado con exito",
        datosAntes: null,
        datosDespues: nuevoMunicipio,
      });

      return generarRespuesta(
        "ok",
        "Municipio creado...",
        {
          municipios: nuevoMunicipio,
          paises: todosPaises,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (municipio): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "municipio",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear municipio",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (municipio)", {}, 500);
  }
}
