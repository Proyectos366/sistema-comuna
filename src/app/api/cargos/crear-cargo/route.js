import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearCargo from "@/services/validarCrearCargo";
import registrarEventoSeguro from "@/libs/trigget";

export async function POST(request) {
  try {
    const { nombre, descripcion } = await request.json();

    const validaciones = await validarCrearCargo(nombre, descripcion);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "INTENTO_FALLIDO_CARGO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al intentar crear cargo",
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

    const nuevoCargo = await prisma.cargo.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        id_usuario: validaciones.id_usuario,
        borrado: false,
      },
    });

    if (!nuevoCargo) {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "ERROR_CREAR_CARGO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el cargo",
        datosAntes: null,
        datosDespues: nuevoCargo,
      });

      return generarRespuesta("error", "Error, no se creo el cargo", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "CREAR_CARGO",
        id_objeto: nuevoCargo.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Cargo creado con exito",
        datosAntes: null,
        datosDespues: nuevoCargo,
      });

      return generarRespuesta(
        "ok",
        "Cargo creado...",
        {
          cargo: nuevoCargo,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (cargos): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "cargo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear cargo",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (cargos)", {}, 500);
  }
}
