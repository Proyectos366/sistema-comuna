import prisma from "@/libs/prisma";
import validarConsultarTodosVoceros from "@/services/voceros/validarConsultarVoceros";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodosVoceros();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // 3. Consulta todos los voceros
    const todosVoceros = await prisma.vocero.findMany({
      select: {
        id: true,
        nombre: true,
        nombre_dos: true,
        apellido: true,
        apellido_dos: true,
        cedula: true,
        telefono: true,
        correo: true,
        edad: true,
        genero: true,
        laboral: true,
        createdAt: true,
        comunas: {
          select: { id: true, nombre: true, id_parroquia: true },
        },
        circuitos: {
          select: { id: true, nombre: true },
        },
        parroquias: {
          select: { id: true, nombre: true },
        },
        consejos: {
          select: { id: true, nombre: true },
        },
        cursos: {
          where: { borrado: false },
          select: {
            verificado: true,
            certificado: true,
            formaciones: {
              select: { id: true, nombre: true },
            },
            asistencias: {
              select: {
                id: true,
                presente: true,
                id_formador: true,
                descripcion: true,
                fecha_validada: true,
                modulos: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
              },
            },
          },
        },
        cargos: {
          select: { nombre: true, id: true },
        },
      },
    });

    // 4. Si no se encuentran voceros retorna respuesta vacía
    if (!todosVoceros) {
      return generarRespuesta("error", "Error, no hay voceros...", {}, 400);
    }

    // 5. Retorna la respuesta exitosa con los voceros encontrados
    return generarRespuesta(
      "ok",
      "Voceros encontrados...",
      { voceros: todosVoceros },
      200,
    );
  } catch (error) {
    // 7. Manejo de errores inesperados
    console.log(`Error interno, al consultar todos los voceros: ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al consultar todos los voceros...",
      {},
      500,
    );
  }
}
