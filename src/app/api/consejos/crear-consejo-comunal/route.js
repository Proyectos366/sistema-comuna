import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearConsejoComunal from "@/services/validarCrearConsejoComunal";

export async function POST(request) {
  try {
    //const {nombre, direccion, norte, sur, este, oeste, punto, rif, id_parroquia } = await request.json();

    const { nombre, id_parroquia, id_comuna, comunaCircuito } =
      await request.json();

    const { direccion, norte, sur, este, oeste, punto, rif, codigo } = "";

    /**
     cuando se vaya a guardar el rif debemos agregarle ejemplo: C-
     es decir algo asi: C-5003648
     */

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
      id_comuna
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
        "Tipo de comuna/circuito inválido",
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
        rif: `j-${Date.now()}`,
        codigo: `${new Date().getTime()}`,
        borrado: false,
        id_usuario: validaciones.id_usuario,
        id_parroquia: validaciones.id_parroquia,
        ...(comunaCircuito === "comuna"
          ? { id_comuna: validaciones.id_comuna }
          : { id_circuito: validaciones.id_comuna }),
      },
    });

    if (!nuevoConsejoComunal) {
      return generarRespuesta("error", "Error, no se creo la comuna", {}, 400);
    } else {
      return generarRespuesta(
        "ok",
        "Comuna creada...",
        {
          consejo: nuevoConsejoComunal,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (comunas): ` + error);

    return generarRespuesta("error", "Error, interno (comunas)", {}, 500);
  }
}
