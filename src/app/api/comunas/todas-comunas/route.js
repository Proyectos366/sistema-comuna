/**
@fileoverview Controlador de API para la consulta de todas las comunas existentes. Este archivo
maneja la lógica para obtener todas las comunas de la base de datosa través de una solicitud GET.
Utiliza Prisma para la interacción con la base de datos y un servicio de validaciónpara asegurar
la validez de la consulta.
@module
*/
// Importaciones de módulos y librerías
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import validarConsultarTodasComunas from "@/services/comunas/validarConsultarTodasComunas"; // Servicio para validar la consulta de todas las comunas.
/**
  Maneja las solicitudes HTTP GET para obtener todas las comunas.
  @async@function GET@returns {Promise<object>} - Una respuesta HTTP en formato JSON con las
  comunas encontradas o un error.
*/

export async function GET() {
  try {
    // 1. Valida la información de la solicitud utilizando el servicio correspondiente
    const validaciones = await validarConsultarTodasComunas();

    // 2. Condición de validación fallida
    if (validaciones.status === "error") {
      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400,
      );
    }

    // Variable para almacenar las comunas consultadas
    let todasComunas;

    // 3. Consulta de comunas según el rol del usuario
    if (validaciones.id_rol === 1) {
      todasComunas = await prisma.comuna.findMany({
        where: {
          borrado: false,
        },
        include: {
          voceros: true,
        },
      });
    } else {
      todasComunas = await prisma.comuna.findMany({
        where: {
          id_parroquia: {
            in: validaciones.id_parroquias,
          },
          borrado: false, // opcional, si quieres excluir comunas marcadas como borradas
        },
        include: {
          voceros: true,
          parroquias: true,
        },
      });
    }

    // 4. Condición de error si no se obtienen comunas
    if (!todasComunas) {
      return generarRespuesta("error", "Error, al consultar comunas", {}, 400);
    }

    // 5. Condición de éxito: se encontraron comunas
    return generarRespuesta(
      "ok",
      "Todas las comunas",
      {
        comunas: todasComunas,
      },
      201,
    );
  } catch (error) {
    // 6. Manejo de errores inesperados
    console.log(`Error interno consultar (comunas): ` + error);

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error, interno consultar (comunas)",
      {},
      500,
    );
  }
}
