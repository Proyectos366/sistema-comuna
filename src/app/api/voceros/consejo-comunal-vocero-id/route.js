import prisma from "@/libs/prisma";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { generarRespuesta } from "@/utils/respuestasAlFront";

export async function GET(request) {
  try {
    // Obtener el ID desde los parámetros de la solicitud
    const { searchParams } = new URL(request.url);
    const idConsejo = searchParams.get("idConsejo");

    const id_consejo = Number(idConsejo);

    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    if (!idConsejo) {
      return generarRespuesta(
        "error",
        "El ID de consejo comunal es obligatorio.",
        {},
        400
      );
    }

    const vocerosPorConsejoComunal = await prisma.vocero.findMany({
      where: {
        id_consejo: id_consejo,
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

    if (!vocerosPorConsejoComunal) {
      return generarRespuesta(
        "ok",
        "No hay voceros en este consejo comunal.",
        { voceros: [] },
        200
      );
    }

    return generarRespuesta(
      "ok",
      "Voceros encontrados.",
      { voceros: vocerosPorConsejoComunal },
      200
    );
  } catch (error) {
    console.log(`Error interno al consultar voceros: ${error}`);

    return generarRespuesta(
      "error",
      "Error interno al consultar voceros.",
      {},
      500
    );
  }
}
