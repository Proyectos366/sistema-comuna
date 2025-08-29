import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generarRespuesta } from "@/utils/respuestasAlFront";
import nombreToken from "@/utils/nombreToken";

import validarInicioSesion from "@/services/validarInicioSesion";
import registrarEventoSeguro from "@/libs/trigget";
import prisma from "@/libs/prisma";
import AuthTokens from "@/libs/AuthTokens";

export async function POST(request) {
  try {
    const { correo, clave } = await request.json();

    const validaciones = await validarInicioSesion(correo, clave);

    if (validaciones.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_LOGIN",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Datos invalidos para el inicio de sesion",
        datosAntes: null,
        datosDespues: validaciones,
      });

      return generarRespuesta(
        validaciones.status,
        validaciones.message,
        {},
        400
      );
    }

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "EXITO_USUARIO_LOGIN",
      id_objeto: 0,
      id_usuario: validaciones.id_usuario,
      descripcion: "Se obtuvieron los datos de usuario para inicio de sesión",
      datosAntes: null,
      datosDespues: validaciones.datosUsuario,
    });

    const response = NextResponse.json({
      status: "ok",
      message: "Inicio de sesion correcto",
      token: validaciones.token,
      redirect: validaciones.redirect,
    });

    response.cookies.set(
      nombreToken,
      validaciones.token,
      validaciones.cookieOption
    );
    return response;
  } catch (error) {
    console.error(`Error interno al iniciar sesion: ` + error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_LOGIN",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al iniciar sesion",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta(
      "error",
      "Error interno al iniciar sesion",
      {},
      500
    );
  }
}

export async function GET(request) {
  try {
    const cookieStore = await cookies(); // Esperar la llamada a cookies()
    const token = cookieStore.get(nombreToken)?.value;

    const descifrarToken = AuthTokens.descifrarToken(token);

    if (descifrarToken.status === "error") {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "INTENTO_FALLIDO_TOKEN_LOGOUT",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "Token invalido para cerrar sesion",
        datosAntes: null,
        datosDespues: descifrarToken,
      });

      return generarRespuesta(
        descifrarToken.status,
        descifrarToken.message,
        {},
        400
      );
    }

    const usuarioLogout = await prisma.usuario.findFirst({
      where: {
        correo: descifrarToken.correo,
      },
      select: {
        id: true,
      },
    });

    if (!usuarioLogout) {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "ERROR_LOGOUT",
        id_objeto: 0,
        id_usuario: 0,
        descripcion: "No se pudo cerrar sesion",
        datosAntes: null,
        datosDespues: null,
      });

      return generarRespuesta("error", "Error, al cerrar sesion", {}, 400);
    } else {
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "EXITO_LOGOUT",
        id_objeto: 0,
        id_usuario: usuarioLogout.id,
        descripcion: "Cierre de sesion correctamente",
        datosAntes: null,
        datosDespues: usuarioLogout,
      });

      cookieStore.delete(nombreToken);

      return generarRespuesta("ok", "Cerrando sesion", {}, 201);
    }
  } catch (error) {
    console.error("Error interno cerrando sesión:", error);

    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "ERROR_INTERNO_LOGOUT",
      id_objeto: 0,
      id_usuario: 0,
      descripcion: "Error inesperado al cerrar sesion",
      datosAntes: null,
      datosDespues: error.message,
    });

    return generarRespuesta("error", "Error interno cerrando sesión", {}, 500);
  }
}
