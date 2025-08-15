import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarDepartamento from "@/services/departamentos/validarEditarDepartamento";

export async function POST(request) {
  try {
    const { nombre, descripcion, id_departamento } = await request.json();

    const validaciones = await validarEditarDepartamento(
      nombre,
      descripcion,
      id_departamento
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario ? validaciones.id_usuario : 0,
        descripcion: "Validacion fallida al intentar editar el departamento",
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

    const [actualizado, departamentoActualizado] = await prisma.$transaction([
      prisma.departamento.update({
        where: { id: validaciones.id_departamento },
        data: {
          nombre: validaciones.nombre,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.departamento.findMany({
        where: {
          id: validaciones.id_departamento,
          borrado: false,
        },
      }),
    ]);

    if (!departamentoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "ERROR_UPDATE_DEPARTAMENTO",
        id_objeto: validaciones.id_departamento,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el departamento",
        datosAntes: { nombre, descripcion, id_departamento },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar el departamento actualizado",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "UPDATE_DEPARTAMENTO",
        id_objeto: departamentoActualizado[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Departamento actualizado con exito id: ${validaciones.id_departamento}`,
        datosAntes: {
          nombre: nombre,
          descripcion: descripcion,
          id_departamento: id_departamento,
        },
        datosDespues: departamentoActualizado,
      });

      return generarRespuesta(
        "ok",
        "Departamento actualizado...",
        { departamento: departamentoActualizado[0] },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar departamento): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el departamento",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar departamento)",
      {},
      500
    );
  }
}
