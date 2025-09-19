import prisma from "@/libs/prisma";
import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import ValidarCampos from "../ValidarCampos";
import obtenerDatosUsuarioToken from "../obtenerDatosUsuarioToken"; // Función para obtener los datos del usuario activo a través del token de autenticación

export default async function validarCrearMunicipio(
  nombre,
  descripcion,
  id_pais,
  id_estado
) {
  try {
    const validaciones = await obtenerDatosUsuarioToken();

    if (validaciones.status === "error") {
      return retornarRespuestaFunciones(
        validaciones.status,
        validaciones.message
      );
    }

    const validarCampos = ValidarCampos.validarCamposCrearMunicipio(
      nombre,
      descripcion,
      id_pais,
      id_estado
    );

    if (validarCampos.status === "error") {
      return retornarRespuestaFunciones(
        validarCampos.status,
        validarCampos.message,
        { id_usuario: validaciones.id_usuario }
      );
    }

    const datosEstado = await prisma.estado.findFirst({
      where: { id: validarCampos.id_estado },
      select: { serial: true, municipios: true },
    });

    const nombreRepetido = await prisma.municipio.findFirst({
      where: {
        nombre: validarCampos.nombre,
        id_estado: validarCampos.id_estado,
      },
    });

    if (nombreRepetido) {
      return retornarRespuestaFunciones(
        "error",
        "Error, municipio ya existe...",
        {
          id_usuario: validaciones.id_usuario,
        }
      );
    }

    const cantidadMunicipios = datosEstado.municipios.length + 1;
    const numeroFormateado =
      cantidadMunicipios < 10
        ? `0${cantidadMunicipios}`
        : `${cantidadMunicipios}`;
    const serialMunicipio = `${datosEstado.serial}-${numeroFormateado}`;

    return retornarRespuestaFunciones("ok", "Validacion correcta", {
      id_usuario: validaciones.id_usuario,
      nombre: validarCampos.nombre,
      descripcion: validarCampos.descripcion,
      serial: serialMunicipio,
      id_pais: validarCampos.id_pais,
      id_estado: validarCampos.id_estado,
    });
  } catch (error) {
    console.log("Error interno validar crear municipio: " + error);

    // Retorna una respuesta del error inesperado
    return retornarRespuestaFunciones(
      "error",
      "Error interno validar crear municipio"
    );
  }
}
