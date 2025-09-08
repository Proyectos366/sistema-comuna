/**
@fileoverview Controlador de API para la consulta de una institución asociada a un miembro. Este
archivo maneja la lógica para obtener la institución relacionada con un miembro específico a
través de una solicitud GET. Utiliza Prisma para la interacción con la base de datos y un servicio
de validación para asegurar la validez de la consulta.@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import validarConsultarInstitucionMiembroId from "@/services/instituciones/validarConsultarInstitucionMiembroId"; // Servicio para validar la consulta de la institución por ID de miembro.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
/**
Maneja las solicitudes HTTP GET para obtener la institución asociada a un municipio específico.@async@function GET@returns {Promise - Una respuesta HTTP en formato JSON con la institución encontrada o un error.
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarInstitucionMiembroId();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    // 3. Consulta la institución en la base de datos asociada al municipio
    const institucionMiembro = await prisma.institucion.findFirst({
      where: {
        id_municipio: validaciones.id_municipio,
        borrado: false,
      },
      include: {
        miembros: {
          select: {
            id: true,
            cedula: true,
            correo: true,
            nombre: true,
            apellido: true,
            borrado: true,
            validado: true,
            createdAt: true,
            id_rol: true,
            roles: {
              select: { nombre: true },
            },
            MiembrosDepartamentos: {
              select: { id: true, nombre: true, descripcion: true },
            },
          },
        },
      },
    });

    // 4. Condición de error si no se encuentra la institución
    if (!institucionMiembro) {
      return generarRespuesta(
        "error",
        "Error, al consultar institucion...",
        {},
        400
      );
    } else {
      // 5. Condición de éxito: se encontró la institución
      return generarRespuesta(
        "ok",
        "Institucion encontrada...",
        {
          instituciones: institucionMiembro,
        },
        201
      );
    }
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (institucion): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (institucion)",
      {},
      500
    );
  }
}
