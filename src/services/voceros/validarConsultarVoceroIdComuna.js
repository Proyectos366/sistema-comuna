import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarVoceroIdComuna(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idComuna = searchParams.get("idComuna");

    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarIdComuna = ValidarCampos.validarCampoId(idComuna, "comuna");

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_comuna: validarIdComuna.id,
    });
  } catch (error) {
    console.log("Error interno validar vocero id_comuna: " + error);
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar vocero id_comuna"
    );
  }
}
