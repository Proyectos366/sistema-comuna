import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearDepartamento from "@/services/validarCrearDepartamento";
import obtenerIp from "@/utils/obtenerIp";
import registrarEventoSeguro from "@/libs/trigget";

export async function POST(request) {
  try {
    const { nombre, descripcion } = await request.json();

    const validaciones = await validarCrearDepartamento(nombre, descripcion);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "INTENTO_FALLIDO",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Validacion fallida al intentar crear departamento",
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

    const nuevoDepartamento = await prisma.departamento.create({
      data: {
        nombre: validaciones.nombre,
        descripcion: validaciones.descripcion,
        id_usuario: validaciones.id_usuario,
      },
    });

    if (!nuevoDepartamento) {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "ERROR_CREAR",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se pudo crear el departamento",
        datosAntes: null,
        datosDespues: nuevoDepartamento,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo el departamento...",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "departamento",
        accion: "CREAR",
        id_objeto: nuevoDepartamento.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Departamento creado con exito",
        datosAntes: null,
        datosDespues: nuevoDepartamento,
      });

      return generarRespuesta(
        "ok",
        "Departamento creado...",
        {
          departamento: nuevoDepartamento,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (departamento): ` + error);
    await registrarEventoSeguro(request, {
      tabla: "departamento",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear departamento",
      datosAntes: null,
      datosDespues: error.message,
    });
    return generarRespuesta("error", "Error, interno (departamento)", {}, 500);
  }
}
