import prisma from "@/libs/prisma";
import AuthTokens from "@/libs/AuthTokens";
import { cookies } from "next/headers";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import msjErrores from "../../../../msj_validaciones/consultar_usuario_activo/msjErrores.json";
import msjCorrectos from "../../../../msj_validaciones/consultar_usuario_activo/msjCorrectos.json";
import nombreToken from "@/utils/nombreToken";
import registrarEventoSeguro from "@/libs/trigget";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_TOKEN_LOGIN",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Token invalido para consultar usuario activo",
        datosAntes: null,
        datosDespues: descifrarToken,
      });

      return generarRespuesta(
        descifrarToken.status,
        descifrarToken.message,
        {},
        msjErrores.codigo.codigo400
      );
    }

    const correo = descifrarToken.correo;

    const datosUsuarioActivo = await prisma.usuario.findFirst({
      where: { correo: correo },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        correo: true,
        id_rol: true,
        borrado: true,
        validado: true,
        createdAt: true,
        MiembrosDepartamentos: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!datosUsuarioActivo) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_GET_DATOS_USUARIO_LOGIN",
        id_objeto: 0,
        id_usuario: 0,
        descripcion:
          "No se pudo obtener los datos del usuario para iniciar sesion",
        datosAntes: null,
        datosDespues: null,
      });

      return generarRespuesta(
        msjErrores.error,
        msjErrores.errorConsultarUsuarioActivo.usuarioNoEncontrado,
        {},
        msjErrores.codigo.codigo400
      );
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "GET_DATOS_USUARIO_LOGIN",
        id_objeto: 0,
        id_usuario: datosUsuarioActivo.id,
        descripcion: "Se obtuvieron los datos de usuario para inicio de sesion",
        datosAntes: null,
        datosDespues: {
          datosUsuarioActivo,
        },
      });

      return generarRespuesta(
        msjCorrectos.ok,
        msjCorrectos.okConsultarUsuarioActivo.usuarioEncontrado,
        {
          usuarioActivo: datosUsuarioActivo,
          departamento:
            datosUsuarioActivo?.MiembrosDepartamentos &&
            datosUsuarioActivo.MiembrosDepartamentos.length > 0
              ? datosUsuarioActivo.MiembrosDepartamentos[0]
              : null,
        },
        msjCorrectos.codigo.codigo200
      );
    }
  } catch (error) {
    console.log(`${msjErrores.errorMixto}: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_USUARIO_ACTIVO",
      id_objeto: 0,
      id_usuario: 0,
      descripcion:
        "Error inesperado al consultar los datos de inicio de sesion",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      msjErrores.error,
      msjErrores.errorConsultarUsuarioActivo.internoValidando,
      {},
      msjErrores.codigo.codigo500
    );
  }
}
