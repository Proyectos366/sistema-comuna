import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarVoceroIdConsejoComunal(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idConsejo = searchParams.get("idConsejo");

    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarIdConsejo = ValidarCampos.validarCampoId(idConsejo, "consejo");

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_consejo: validarIdConsejo.id,
    });
  } catch (error) {
    console.log("Error interno validar vocero id_consejo: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar vocero id_consejo"
    );
  }
}
