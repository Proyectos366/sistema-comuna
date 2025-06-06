import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearCircuito from "@/services/validarCrearCircuito";

export async function POST(request) {
  try {
    //const {nombre, direccion, norte, sur, este, oeste, punto, rif, id_parroquia } = await request.json();

    const { nombre, id_parroquia } = await request.json();

    const { direccion, norte, sur, este, oeste, punto } = "";

    const validaciones = await validarCrearCircuito(
      nombre,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
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

    const nuevoCircuito = await prisma.circuito.create({
      data: {
        nombre: validaciones.nombre,
        direccion: validaciones.direccion,
        norte: validaciones.norte,
        sur: validaciones.sur,
        este: validaciones.este,
        oeste: validaciones.oeste,
        punto: validaciones.punto,
        borrado: false,
        validado: false,
        id_usuario: validaciones.id_usuario,
        id_parroquia: validaciones.id_parroquia,
      },
    });

    if (!nuevoCircuito) {
      return generarRespuesta(
        "error",
        "Error, no se creo el circuito",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Circuito creado...",
        {
          circuito: nuevoCircuito,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (circuitos): ` + error);

    return generarRespuesta("error", "Error, interno (circuitos)", {}, 500);
  }
}
