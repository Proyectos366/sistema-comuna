import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(req) {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { searchParams } = new URL(req.url);
    const idComuna = searchParams.get("idComuna");

    const id_comuna = Number(idComuna);

    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    if (!idComuna) {
      return generarRespuesta(
        "error",
        "El ID de comuna es obligatorio.",
        {},
        400
      );
    }

    const voceroPorComuna = await prisma.vocero.findMany({
      where: {
        id_comuna: id_comuna,
        id_consejo: null,
        borrado: false,
      },
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
        comunas: {
          select: { nombre: true, id: true, id_parroquia: true },
        },
        circuitos: {
          select: { nombre: true, id: true },
        },
        parroquias: {
          select: { nombre: true },
        },
        consejos: { select: { nombre: true } },
        cursos: {
          where: { borrado: false },
          select: {
            verificado: true,
            certificado: true,
            formaciones: { select: { nombre: true } },
            asistencias: {
              select: {
                id: true,
                presente: true,
                formador: true,
                fecha_registro: true,
                modulos: { select: { id: true, nombre: true } },
              },
            },
          },
        },
        cargos: {
          select: { nombre: true, id: true },
        },
      },
    });

    if (voceroPorComuna.length === 0) {
      return generarRespuesta(
        "error",
        "No hay voceros en esta comuna...",
        { voceros: [] },
        400
      );
    }

    return generarRespuesta(
      "ok",
      "Voceros encontrados.",
      { voceros: voceroPorComuna },
      200
    );
  } catch (error) {
    console.log(`Error, interno al consultar voceros comuna: ${error}`);

    return generarRespuesta(
      "error",
      "Error, interno al consultar voceros comuna...",
      {},
      500
    );
  }
}
