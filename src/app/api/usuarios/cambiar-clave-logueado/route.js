import prisma from "@/libs/prisma";
import validarCambiarClaveLogueado from "@/services/validarCambiarClaveLogueado";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/cambiar_clave/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/cambiar_clave/msjCorrectos.json";
import registrarEventoSeguro from "@/libs/trigget";

export async function POST(request) {
  try {
    const { claveVieja, claveUno, claveDos } = await request.json();

    const validaciones = await validarCambiarClaveLogueado(
      claveVieja,
      claveUno,
      claveDos
    );

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_CAMBIAR_CLAVE_LOGGEADO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "Validacion fallida al cambiar clave, usuario loggeado",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        msjErrores.codigo.codigo400
      );
    }

    const claveCambiadaUsuarioLoggueado = await prisma.usuario.update({
      where: { id: validaciones.id_usuario },
      data: { clave: validaciones.claveEncriptada },
    });

    if (!claveCambiadaUsuarioLoggueado) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_UPDATE_CAMBIAR_CLAVE_LOGGUEADO",
        id_objeto: 0,
        id_usuario: validaciones.id_usuario,
        descripcion: "No se puedo cambiar la clave de usuario loggueado",
        datosAntes: null,
        datosDespues: {
          claveCambiadaUsuarioLoggueado,
        },
      });

      return generarRespuesta(
        msjErrores.error,
        msjErrores.errorCambioClave.cambioFallido,
        {},
        msjErrores.codigo.codigo400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "UPDATE_CAMBIAR_CLAVE_LOGGUEADO",
        id_objeto: claveCambiadaUsuarioLoggueado.id,
        id_usuario: validaciones.id_usuario,
        descripcion: "Cambio de clave exitoso usuario loggeado",
        datosAntes: null,
        datosDespues: {
          claveCambiadaUsuarioLoggueado,
        },
      });

      return generarRespuesta(
        msjCorrectos.ok,
        msjCorrectos.okCambioClave.cambioExitoso,
        {},
        msjCorrectos.codigo.codigo201
      );
    }
  } catch (error) {
    console.log(`${msjErrores.errorMixto}: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_CAMBIO_CLAVE_LOGGUEADO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al cambiar clave loggueado",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorCambioClave.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
