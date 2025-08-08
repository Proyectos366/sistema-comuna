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
      pais,
      estado,
      municipio,
      parroquia,
      sector,
      direccion,
      id_municipio,
    } = await request.json();

    const validaciones = await validarCrearInstitucion(
      nombre,
      descripcion,
      rif,
      pais,
      estado,
      municipio,
      parroquia,
      sector,
      direccion,
      id_municipio
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "institucion",
        accion: "INTENTO_FALLIDO_INSTITUCION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear una institucion",
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
        pais: validaciones.pais,
        estado: validaciones.estado,
        municipio: validaciones.municipio,
        parroquia: validaciones.parroquia,
        sector: validaciones.sector,
        direccion: validaciones.direccion,
        id_usuario: validaciones.id_usuario,
        id_municipio: validaciones.id_municipio,
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
        "Error, no se creo la institucion...",
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
        "Institucion creada...",
        {
          institucion: nuevaInstitucion,
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
      descripcion: "Error inesperado al crear la institucion",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (institucion)", {}, 500);
  }
}
