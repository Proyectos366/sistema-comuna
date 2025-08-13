import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarEditarEstado from "@/services/paises/validarEditarEstado";












/** Falta arreglar este codigo y crear la funcion de validar el editar */
export async function POST(request) {
  try {
    const { nombre, capital, codigoPostal, descripcion, id_pais, id_estado } =
      await request.json();

    const validaciones = await validarEditarEstado(
      nombre,
      capital,
      codigoPostal,
      descripcion,
      id_pais,
      id_estado
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "INTENTO_FALLIDO_ESTADO",
        id_objeto: 0,
        id_usuario: validaciones?.id_usuario,
        descripcion: "Validacion fallida al intentar editar el estado",
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

    const [actualizado, estadoActualizado] = await prisma.$transaction([
      prisma.estado.update({
        where: { id: validaciones.id_estado },
        data: {
          nombre: validaciones.nombre,
          capital: validaciones.capital,
          cod_postal: validaciones.codigoPostal,
          descripcion: validaciones.descripcion,
        },
      }),

      prisma.estado.findFirst({
        where: {
          id: validaciones.id_estado,
          borrado: false,
        },
      }),
    ]);

    const todosPaises = await prisma.pais.findMany({
      where: { borrado: false },
    });

    if (!estadoActualizado) {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "ERROR_UPDATE_PAIS",
        id_objeto: validaciones.id_pais,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo actualizar el pais",
        datosAntes: { nombre, capital, descripcion, id_pais },
        datosDespues: actualizado,
      });

      return generarRespuesta(
        "error",
        "Error, al consultar el pais actualizado",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "UPDATE_PAIS",
        id_objeto: estadoActualizado[0]?.id,
        id_usuario: validaciones.id_usuario,
        descripcion: `Pais actualizado con exito id: ${validaciones.id_pais}`,
        datosAntes: {
          nombre: validaciones.nombre,
          capital: validaciones.capital,
          descripcion: validaciones.descripcion,
          id_pais: validaciones.id_pais,
        },
        datosDespues: estadoActualizado,
      });

      return generarRespuesta(
        "ok",
        "Pais actualizado...",
        { estados: estadoActualizado, paises: todosPaises },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (actualizar pais): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "pais",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al actualizar el pais",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error, interno (actualizar pais)",
      {},
      500
    );
  }
}
