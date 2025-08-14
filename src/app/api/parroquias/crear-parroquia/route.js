import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearParroquia from "@/services/parroquias/validarCrearParroquia";
import registrarEventoSeguro from "@/libs/trigget";

export async function POST(request) {
  try {
    const { nombre, descripcion, id_pais, id_estado, id_municipio } =
      await request.json();

    const validaciones = await validarCrearParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "INTENTO_FALLIDO_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear parroquia",
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

    const nuevaParroquia = await prisma.parroquia.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        serial: validaciones.serial,
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
              },
            },
          },
        },
      },
    });

    if (!nuevaParroquia) {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "ERROR_CREAR_PARROQUIA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear la parroquia",
        datosAntes: null,
        datosDespues: nuevaParroquia,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo la parroquia",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "parroquia",
        accion: "CREAR_PARROQUIA",
        id_objeto: nuevaParroquia.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Parroquia creada con exito",
        datosAntes: null,
        datosDespues: nuevaParroquia,
      });

      return generarRespuesta(
        "ok",
        "Parroquia creada...",
        {
          parroquias: nuevaParroquia,
          paises: todosPaises,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (parroquias): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "parroquia",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear parroquia",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (parroquias)", {}, 500);
  }
}
