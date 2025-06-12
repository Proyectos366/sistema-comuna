import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearConsejoComunal from "@/services/validarCrearConsejoComunal";

export async function POST(request) {
  try {
    const { nombre, id_parroquia, id_comuna, id_circuito, comunaCircuito } =
      await request.json();

    const { direccion, norte, sur, este, oeste, punto, rif, codigo } = "";

    const validaciones = await validarCrearConsejoComunal(
      nombre,
      direccion,
      norte,
      sur,
      este,
      oeste,
      punto,
      rif,
      codigo,
      id_parroquia,
      id_comuna,
      id_circuito
    );

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    if (!["comuna", "circuito"].includes(comunaCircuito)) {
      return generarRespuesta(
        "error",
        `Tipo de ${
          comunaCircuito === "comuna" ? "comuna inválida" : "circuito inválido"
        }`,
        {},
        400
      );
    }

    const nuevoConsejoComunal = await prisma.consejo.create({
      data: {
        nombre: validaciones.nombre,
        direccion: validaciones.direccion,
        norte: validaciones.norte,
        sur: validaciones.sur,
        este: validaciones.este,
        oeste: validaciones.oeste,
        punto: validaciones.punto,
        rif: `C-${Date.now()}`,
        codigo: `${new Date().getTime()}`,
        borrado: false,
        id_usuario: validaciones.id_usuario,
        id_parroquia: validaciones.id_parroquia,
        id_comuna: validaciones.id_comuna,
        id_circuito: validaciones.id_circuito,
      },
    });

    if (!nuevoConsejoComunal) {
      return generarRespuesta("error", "Error, no se creo el consejo comunal...", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Consejo comunal creado...",
        {
          consejo: nuevoConsejoComunal,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (consejo comunal): ` + error);

    return generarRespuesta("error", "Error, interno (consejo comunal)", {}, 500);
  }
}
