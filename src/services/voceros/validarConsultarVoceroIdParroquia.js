import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarVoceroIdParroquia(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParroquia = searchParams.get("idParroquia");

    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarIdParroquia = ValidarCampos.validarCampoId(
      idParroquia,
      "parroquia"
    );

    if (validarIdParroquia.status === "error") {
      return retornarRespuestaFunciones(
        validarIdParroquia.status,
        validarIdParroquia.message
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_parroquia: validarIdParroquia.id,
    });
  } catch (error) {
    console.log("Error interno validar vocero id_parroquia: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar vocero id_parroquia"
    );
  }
}
