import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearConsejoComunal from "@/services/validarCrearConsejoComunal";
import registrarEventoSeguro from "@/libs/trigget";

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
      id_circuito,
      comunaCircuito
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "INTENTO_FALLIDO_CONSEJO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear consejo comunal",
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

    if (!["comuna", "circuito"].includes(comunaCircuito)) {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_CONSEJO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Error de comuna o circuito comunal",
        datosAntes: null,
        datosDespues: comunaCircuito,
      });

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
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "ERROR_CREAR_CONSEJO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el consejo comunal",
        datosAntes: null,
        datosDespues: nuevoConsejoComunal,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo el consejo comunal...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "consejo",
        accion: "CREAR_CONSEJO",
        id_objeto: nuevoConsejoComunal.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Consejo comunal creado con exito",
        datosAntes: null,
        datosDespues: nuevoConsejoComunal,
      });

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

    await registrarEventoSeguro(request, {
      tabla: "consejo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear consejo comunal",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (consejo comunal)",
      {},
      500
    );
  }
}
