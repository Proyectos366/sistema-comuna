import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearFormacion from "@/services/validarCrearFormacion";
import registrarEventoSeguro from "@/libs/trigget";

export async function POST(request) {
  try {
    const { nombre, cantidadModulos } = await request.json();

    const validaciones = await validarCrearFormacion(nombre, cantidadModulos);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "INTENTO_FALLIDO_FORMACION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "Validación fallida al intentar crear formación",
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

    const nuevaFormacion = await prisma.formacion.create({
      data: {
        nombre: validaciones.nombre,
        id_usuario: validaciones.id_usuario,
        id_departamento: validaciones.id_departamento,
        modulos: {
          connect: validaciones.todosModulos.map(({ id }) => ({ id })),
        },
      },
    });

    if (!nuevaFormacion) {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "ERROR_CREAR_FORMACION",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario ?? 0,
        descripcion: "No se pudo crear la formación",
        datosAntes: null,
        datosDespues: nuevoCargo,
      });

      return generarRespuesta(
        "error",
        "Error, no se creo la formacion",
        {},
        400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "formacion",
        accion: "CREAR_FORMACION",
        id_objeto: nuevaFormacion.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Formacion creada con exito",
        datosAntes: null,
        datosDespues: nuevaFormacion,
      });

      return generarRespuesta(
        "ok",
        "Formacion creada...",
        {
          formacion: nuevaFormacion,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (formaciones): ` + error);

    await registrarEventoSeguro(request, {
      tabla: "formacion",
      accion: "ERROR_INTERNO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al crear formacion",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error, interno (formaciones)", {}, 500);
  }
}
