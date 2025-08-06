import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import validarConsultarTodasFormaciones from "@/services/formaciones/validarConsultarTodasFormaciones";

export async function GET() {
  try {
    const validaciones = await validarConsultarTodasFormaciones();

    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    /**
      // Esta consulta sera para el futuro para mostrar formaciones solo por departamento
      const todasFormaciones = await prisma.formacion.findMany({
        where: {
          borrado: false,
          culminada: false,
          id_departamento: validaciones.id_departamento ? validaciones.id_departamento && 3 : 3,
        },
      });

    
      const todasFormaciones = await prisma.formacion.findMany({
        where: {
          borrado: false,
          culminada: false,
        },
        include: { modulos: true },
      });
    */

    let whereCondicion;

    if (validaciones.id_usuario === 1 || validaciones.id_usuario === 2) {
      // Admin o usuario privilegiado: ver todas las formaciones no borradas ni culminadas
      whereCondicion = {
        borrado: false,
        culminada: false,
      };
    } else {
      // Usuarios comunes: aplicar lógica de filtro por departamento
      let filtroDepartamento;

      if (validaciones.id_departamento === null) {
        filtroDepartamento = null;
      } else if (validaciones.id_departamento === 3) {
        filtroDepartamento = 3;
      } else {
        filtroDepartamento = {
          OR: [
            { id_departamento: validaciones.id_departamento },
            { id_departamento: null },
          ],
        };
      }

      whereCondicion = {
        borrado: false,
        culminada: false,
        ...(typeof filtroDepartamento === "object"
          ? filtroDepartamento
          : { id_departamento: filtroDepartamento }),
      };
    }

    const todasFormaciones = await prisma.formacion.findMany({
      where: whereCondicion,
      include: { modulos: true },
    });

    if (!todasFormaciones) {
      return generarRespuesta(
        "error",
        "Error, al consultar formaciones...",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Todas las formaciones...",
        {
          formaciones: todasFormaciones,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno consultar (formaciones): ` + error);

    return generarRespuesta(
      "error",
      "Error, interno consultar (formaciones)",
      {},
      500
    );
  }
}
