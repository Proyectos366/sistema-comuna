import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarCargo from "@/services/cargos/validarEditarCargo";

export async function POST(request) {
  try {
    const { nombre, descripcion, id_cargo } = await request.json();

    const validaciones = await validarEditarCargo(
      nombre,
      descripcion,
      id_cargo
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar el cargo",
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

    const [actualizado, cargoActualizado] = await prisma.$transaction([
      prisma.cargo.update({
        where: { id: validaciones.id_cargo },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.cargo.findMany({
        where: {
          id: validaciones.id_cargo,
          borrado: false,
        },
      }),
    ]);

    if (!cargoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "ERROR_UPDATE_CARGO",
        id_objeto: validaciones.id_cargo,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el cargo",
        datosAntes: { nombre, descripcion, id_cargo },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar el cargo actualizado",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "cargo",
        accion: "UPDATE_CARGO",
        id_objeto: cargoActualizado[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Cargo actualizado con exito id: ${validaciones.id_formacion}`,
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          id_cargo: id_cargo,
        },
        datosDespues: cargoActualizado,
      });

      return generarRespuesta(
        "ok",
        "Cargo actualizado...",
        { cargo: cargoActualizado[0] },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar cargo): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "cargo",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el cargo",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar cargo)",
      {},
      500
    );
  }
}
