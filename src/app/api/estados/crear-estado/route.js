import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarCrearEstado from "@/services/estados/validarCrearEstado";

export async function POST(request) {
  try {
    const { nombre, capital, codigoPostal, descripcion, id_pais } =
      await request.json();

    const validaciones = await validarCrearEstado(
      nombre,
      capital,
      codigoPostal,
      descripcion,
      id_pais
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "INTENTO_FALLIDO_ESTADO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear el estado",
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

    const nuevoEstado = await prisma.estado.create({
      data: {
        nombre: validaciones.nombre,
        capital: validaciones.capital,
        cod_postal: validaciones.codigoPostal,
        descripcion: validaciones.descripcion,
        serial: validaciones.serial,
        id_usuario: validaciones.id_usuario,
        id_pais: validaciones.id_pais,
      },
    });

    const todosPaises = await prisma.pais.findMany({
      where: { borrado: false },
    });

    if (!nuevoEstado) {
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "ERROR_CREAR_ESTADO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el estado",
        datosAntes: null,
        datosDespues: nuevoEstado,
      });

      return generarRespuesta("error", "Error, no se creo el estado", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "estado",
        accion: "CREAR_ESTADO",
        id_objeto: nuevoEstado.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Estado creado con exito",
        datosAntes: null,
        datosDespues: nuevoEstado,
      });

      return generarRespuesta(
        "ok",
        "Estado creado...",
        {
          estados: nuevoEstado,
          paises: todosPaises,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (estados): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "estado",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear estado",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (estados)", {}, 500);
  }
}
