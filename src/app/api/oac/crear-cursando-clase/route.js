import prisma from "@/libs/prisma";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import { calcularFechaNacimientoPorEdad } from "@/utils/Fechas";

export async function POST(request) {
  try {
    const { cedula, idParroquia, idComuna, idConsejo, idClase, edad, genero } =
      await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    const correo = descifrarToken.correo;
    const cedulaNumero = Number(cedula);
    const id_parroquia = Number(idParroquia);
    const id_comuna = Number(idComuna);
    const id_consejo = Number(idConsejo);
    const id_clase = Number(idClase);
    const edadNumero = Number(edad);
    const sexo = Number(genero);
    const fechaNacimiento = calcularFechaNacimientoPorEdad(edadNumero);

    const idUsuario = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: { id: true },
    });

    const nuevoCursando = await prisma.cursando.create({
      data: {
        cedula: cedulaNumero,
        edad: edadNumero,
        genero: sexo === 1 ? true : false,
        f_n: fechaNacimiento,
        id_usuario: idUsuario.id,
        id_parroquia: id_parroquia,
        id_comuna: id_comuna,
        id_consejo: id_consejo,
        id_clase: id_clase,
      },
    });

    if (!nuevoCursando) {
      return generarRespuesta(
        "error",
        "Error, no se creo el registro",
        {},
        400
      );
    } else {
      return generarRespuesta(
        "ok",
        "Cursando creado...",
        {
          cursando: nuevoCursando,
        },
        201
      );
    }
  } catch (error) {
    console.log(`Error interno (cursando): ` + error);

    return generarRespuesta("error", "Error, interno (cursando)", {}, 500);
  }
}
