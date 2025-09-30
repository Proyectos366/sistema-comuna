/**
@fileoverview Controlador de API para el inicio de sesión de usuarios. Este archivo maneja la
lógica para autenticar a un usuario a través de una solicitud POST y el archivo tambien contiene
una peticion GET para el cierre de sesion. Utiliza Prisma para la interacción con la base de datos,
un servicio de validación para asegurar la validez de los datos, y un sistema de registro de eventos
para la auditoría.@module
*/
// Importaciones de módulos y librerías
import { NextResponse } from "next/server"; // Importa la respuesta para Next.js.
import { cookies } from "next/headers"; // Módulo para gestionar cookies en las solicitudes.
import { generarRespuesta } from "@/utils/respuestasAlFront"; // Utilidad para estandarizar las respuestas de la API.
import nombreToken from "@/utils/nombreToken"; // Utilidad para obtener el nombre del token de autenticación.
import validarInicioSesion from "@/services/validarInicioSesion"; // Servicio para validar el inicio de sesión del usuario.
import registrarEventoSeguro from "@/libs/trigget"; // Función para registrar eventos de seguridad.
import prisma from "@/libs/prisma"; // Cliente de Prisma para la conexión a la base de datos.
import AuthTokens from "@/libs/AuthTokens"; // Servicio para manejar la lógica de autenticación de tokens.

/**
Maneja las solicitudes HTTP POST para el inicio de sesión de usuarios.@async@function POST@param {Request} request - Objeto de la solicitud que contiene los credenciales del usuario.@returns {Promise<object>} - Una respuesta HTTP en formato JSON que indica el resultado de la operación (exito o error).
*/
export async function POST(request) {
  try {
    // 1. Extrae datos de la solicitud JSON
    const { correo, clave } = await request.json();

    // 2. Valida las credenciales utilizando el servicio correspondiente
    const validaciones = await validarInicioSesion(correo, clave);

    // 3. Condición de validación fallida
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

    // 4. Registra el evento de éxito
    await registrarEventoSeguro(request, {
      tabla: "usuario",
      accion: "EXITO_USUARIO_LOGIN",
      id_objeto: 0,
      id_usuario: validaciones.id_usuario,
      descripcion: "Se obtuvieron los datos de usuario para inicio de sesión",
      datosAntes: null,
      datosDespues: validaciones.datosUsuario,
    });

    // 5. Crea una respuesta JSON con el token y redirección
    const response = NextResponse.json({
      status: "ok",
      message: "Iniciando sesión...",
      token: validaciones.token,
      redirect: validaciones.redirect,
    });

    // 6. Configura la cookie con el token
    response.cookies.set(
      nombreToken,
      validaciones.token,
      validaciones.cookieOption
    );
    return response; // Retorna la respuesta configurada
  } catch (error) {
    // 7. Manejo de errores inesperados
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

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta(
      "error",
      "Error interno al iniciar sesion",
      {},
      500
    );
  }
}

/**
@fileoverview Controlador de API para cerrar sesión de un usuario. Este archivo maneja la lógica
para cerrar la sesión de un usuario a través de una solicitud GET. Utiliza Prisma para la
interacción con la base de datos, un sistema de registro de eventos para auditoría y validación
de tokens para asegurar la autenticidad de la sesión.@module
*/
export async function GET(request) {
  try {
    // 1. Recupera las cookies y el token de autenticación
    const cookieStore = await cookies(); // Esperar la llamada a cookies()
    const token = cookieStore.get(nombreToken)?.value;

    // 2. Descifra el token de autenticación
    const descifrarToken = AuthTokens.descifrarToken(token);

    // 3. Verifica si el token es válido
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

    // 4. Consulta el usuario para el cierre de sesión
    const usuarioLogout = await prisma.usuario.findFirst({
      where: {
        correo: descifrarToken.correo,
      },
      select: {
        id: true,
      },
    });

    // 5. Condición de error si no se encuentra el usuario
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
      // 6. Condición de éxito: el cierre de sesión se realiza correctamente
      await registrarEventoSeguro(request, {
        tabla: "usuario",
        accion: "EXITO_LOGOUT",
        id_objeto: 0,
        id_usuario: usuarioLogout.id,
        descripcion: "Cierre de sesion correctamente",
        datosAntes: null,
        datosDespues: usuarioLogout,
      });

      // 7. Elimina el token de las cookies
      cookieStore.delete(nombreToken);

      return generarRespuesta("ok", "Cerrando sesion", {}, 201);
    }
  } catch (error) {
    // 8. Manejo de errores inesperados
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

    // Retorna una respuesta de error con un código de estado 500 (Internal Server Error)
    return generarRespuesta("error", "Error interno cerrando sesión", {}, 500);
  }
}
