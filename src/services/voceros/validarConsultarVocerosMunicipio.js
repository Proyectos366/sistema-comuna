import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarConsultarVocerosMunicipio() {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    let idParroquias;

    if (validaciones.id_rol !== 1) {
      const parroquias = await prisma.parroquia.findMany({
        where: {
          id_municipio: validaciones.id_municipio,
        },
        select: {
          id: true,
        },
      });

      idParroquias = parroquias.map((p) => p.id);
    }

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      correo: validaciones.correo,
      id_parroquias: idParroquias,
      id_rol: validaciones.id_rol,
    });
  } catch (error) {
    console.log("Error interno validar consultar voceros municipio: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar consultar voceros municipio"
    );
  }
}
