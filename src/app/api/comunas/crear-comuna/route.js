import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearComuna from "@/services/comunas/validarCrearComuna";
import registrarEventoSeguro from "@/libs/trigget";

export async function POST(request) {
  try {
    //const {nombre, direccion, norte, sur, este, oeste, punto, rif, id_parroquia } = await request.json();

    const { nombre, rif, codigo, id_parroquia } = await request.json();

    const { direccion, norte, sur, este, oeste, punto } = "";

    const validaciones = await validarCrearComuna(
      nombre,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
      rif,
      codigo,
      id_parroquia
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "INTENTO_FALLIDO_COMUNA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear comuna",
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

    const nuevaComuna = await prisma.comuna.create({
      data: {
        nombre: validaciones.nombre,
        direccion: validaciones.direccion,
        norte: validaciones.norte,
        sur: validaciones.sur,
        este: validaciones.este,
        oeste: validaciones.oeste,
        punto: validaciones.punto,
        rif: `${new Date().getTime()}`,
        codigo: `${new Date().getTime()}`,
        borrado: false,
        id_usuario: validaciones.id_usuario,
        id_parroquia: validaciones.id_parroquia,
      },
    });

    if (!nuevaComuna) {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "ERROR_CREAR_COMUNA",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear la comuna",
        datosAntes: null,
        datosDespues: nuevaComuna,
      });
      return generarRespuesta("error", "Error, no se creo la comuna", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "comuna",
        accion: "CREAR_COMUNA",
        id_objeto: nuevaComuna.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Comuna creada con exito",
        datosAntes: null,
        datosDespues: nuevaComuna,
      });

      return generarRespuesta(
        "ok",
        "Comuna creada...",
        {
          comunas: nuevaComuna,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (comunas): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "comuna",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear comuna",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (comunas)", {}, 500);
  }
}
