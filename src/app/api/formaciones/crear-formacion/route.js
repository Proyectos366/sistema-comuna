import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarCrearFormacion from "@/services/validarCrearFormacion";

export async function POST(request) {
  try {
    const { nombre, cantidadModulos } = await request.json();

    const validaciones = await validarCrearFormacion(nombre, cantidadModulos);

    if (validaciones.status === "error") {
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
      return generarRespuesta(
        "error",
        "Error, no se creo la formacion",
        {},
        400
      );
    } else {
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

    return generarRespuesta("error", "Error, interno (formaciones)", {}, 500);
  }
}

/**
  // Recibiendo por parametro los cantidadModulos que quiero puedo usar esta consulta
  const todoscantidadModulos = await prisma.modulo.findMany({
    where: {
      borrado: false,
        id: {
          in: cantidadModulos, // cantidadModulos debe ser un array de IDs que tú escojas
        },
    },
    select: { id: true },
  });
*/
