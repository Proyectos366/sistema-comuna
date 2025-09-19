import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearParroquia(
  nombre,
  descripcion,
  id_pais,
  id_estado,
  id_municipio
) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarCampos = ValidarCampos.validarCamposCrearParroquia(
      nombre,
      descripcion,
      id_pais,
      id_estado,
      id_municipio
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message
      );
    }

    const datosMunicipio = await prisma.municipio.findFirst({
      where: { id: validarCampos.id_municipio },
      select: { serial: true, parroquias: true },
    });

    const nombreRepetido = await prisma.parroquia.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_municipio: validarCampos.id_municipio,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, parroquia ya existe...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    const cantidadParroquias = datosMunicipio.parroquias.length + 1;
    const numeroFormateado =
      cantidadParroquias < 10
        ? `0${cantidadParroquias}`
        : `${cantidadParroquias}`;
    const serialParroquia = `${datosMunicipio.serial}-${numeroFormateado}`;

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      serial: serialParroquia,
      id_pais: validarCampos.id_pais,
      id_estado: validarCampos.id_estado,
      id_municipio: validarCampos.id_municipio,
    });
  } catch (error) {
    console.log("Error interno validar crear parroquia: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear parroquia"
    );
  }
}
