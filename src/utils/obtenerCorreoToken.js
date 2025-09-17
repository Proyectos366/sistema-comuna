import { cookies } from "next/headers";
import AuthTokens from "@/libs/AuthTokens";
import nombreToken from "@/utils/nombreToken";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";

export default async function obtenerCorreoToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      return retornarRespuestaFunciones(
        descifrarToken.status,
        descifrarToken.message
      );
    }

    const correoObtenido = descifrarToken.correo;
    const correo = correoObtenido.toLowerCase();
    const id_rol = descifrarToken.id_rol;

    return retornarRespuestaFunciones("ok", "Correo obtenido correcto...", {
      correo: correo,
      id_rol: id_rol,
    });
  } catch (error) {
    console.log(`Error, interno obtener correo: ` + error);
    return retornarRespuestaFunciones(
      "error",
      "Error, interno obtener correo..."
    );
  }
}
