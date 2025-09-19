import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación
import ValidarCampos from "../ValidarCampos";

export default async function validarConsultarVoceroCedula(cedula) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarCedula = ValidarCampos.validarCampoCedula(cedula);

    if (validarCedula.status === "error") {
      return retornarRespuestaFunciones(
        validarCedula.status,
        validarCedula.message
      );
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      cedula: validarCedula.cedula,
    });
  } catch (error) {
    console.log("Error interno validar usuario cedula: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar usuario cedula"
    );
  }
}
