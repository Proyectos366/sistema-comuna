import { startOfWeek, endOfWeek } from "date-fns";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarTodasNovedadesDepartamento() {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 }); // Lunes
    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 }); // Domingo

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      id_departamento: validaciones.id_departamento,
      id_institucion: validaciones.id_institucion ?? null,
      correo: validaciones.correo,
      inicioSemana: inicioSemana,
      finSemana: finSemana,
    });
  } catch (err) {
    console.log("Error interno validar consultar novedad departamento: " + err);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar novedad departamento"
    );
  }
}
