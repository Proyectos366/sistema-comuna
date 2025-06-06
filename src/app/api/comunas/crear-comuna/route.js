import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearComuna from "@/services/validarCrearComuna";

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
      return generarRespuesta("error", "Error, no se creo la comuna", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Comuna creada...",
        {
          comuna: nuevaComuna,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (comunas): ` + error);

    return generarRespuesta("error", "Error, interno (comunas)", {}, 500);
  }
}
