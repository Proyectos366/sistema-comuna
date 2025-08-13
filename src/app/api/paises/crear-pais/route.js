import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import registrarEventoSeguro from "@/libs/trigget";
import validarCrearPais from "@/services/paises/validarCrearPais";

export async function POST(request) {
  try {
    const { nombre, capital, descripcion, serial } = await request.json();

    const validaciones = await validarCrearPais(
      nombre,
      capital,
      descripcion,
      serial
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "INTENTO_FALLIDO_PAIS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validacion fallida al intentar crear pais",
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

    const nuevoPais = await prisma.pais.create({
      data: {
        nombre: validaciones.nombre,
        capital: validaciones.capital,
        descripcion: validaciones.descripcion,
        serial: validaciones.serial,
        id_usuario: validaciones.id_usuario,
      },
    });

    if (!nuevoPais) {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "ERROR_CREAR_PAIS",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el pais",
        datosAntes: null,
        datosDespues: nuevoPais,
      });

      return generarRespuesta("error", "Error, no se creo el pais", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "pais",
        accion: "CREAR_PAIS",
        id_objeto: nuevoPais.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Pais creado con exito",
        datosAntes: null,
        datosDespues: nuevoPais,
      });

      return generarRespuesta(
        "ok",
        "Pais creado...",
        {
          paises: nuevoPais,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (pais): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "pais",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear pais",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (pais)", {}, 500);
  }
}
