import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarVoceroIdCircuito(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idCircuito = searchParams.get("idCircuito");

    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarIdCircuito = ValidarCampos.validarCampoId(
      idCircuito,
      "circuito"
    );

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_circuito: validarIdCircuito.id,
    });
  } catch (error) {
    console.log("Error interno validar vocero id_circuito: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar vocero id_circuito"
    );
  }
}
