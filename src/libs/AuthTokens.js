import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

//process.loadEnvFile();

dotenv.config();

export default class AuthTokens {
  /** tokenValidarUsuario es la encargada de generar el token al momento de
  registrar un nuevo empleado y tambien sirve para generar un token para
  el cambio de clave por olvido */
  static tokenValidarUsuario(num) {
    let result1 = Math.random().toString(34).substring(0, num);
    let result2 = Math.random().toString(34).substring(0, num);
    const token1 = result1
      .split("; ")
      .find((cookie) => cookie.startsWith("0."))
      .slice(2);
    const token2 = result2
      .split("; ")
      .find((cookie) => cookie.startsWith("0."))
      .slice(2);

    return token1 + token2;
  }

  /** tokenInicioSesion token creado para poder iniciar sesion */
  static tokenInicioSesion(correo, rol) {
    try {
      // Validar configuración previa
      if (
        !process.env.JWT_SECRET ||
        !process.env.JWT_EXPIRATION ||
        !process.env.JWT_COOKIE_EXPIRES
      ) {
        return {
          status: "error",
          numero: 0,
          message: "Error, variables de entorno vacias...",
        };
      }

      // Generar el token
      const token = jsonwebtoken.sign(
        {
          correo: correo,
          rol: rol,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION,
        }
      );

      /** 
      // Configurar opciones de la cookie
      const cookieOption = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
        sameSite: "strict", // Protección contra CSRF
      };
*/

      const cookieOption = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        path: "/",
        httpOnly: true, // Mantener este flag por seguridad
        secure: false, // Cambiar a false si solo usas HTTP
        sameSite: "lax", // Permitir solicitudes dentro de la red sin problemas
      };

      return {
        status: "ok",
        numero: 1,
        message: "Token/cookie creadas con éxito...",
        token: token,
        cookieOption: cookieOption,
      };
    } catch (error) {
      console.error("Error al generar el token o la cookie:", error);
      return {
        status: "error",
        numero: 0,
        message: "Error al crear token/cookie...",
      };
    }
  }

  /** descifrarToken se encarga de descifrar el token y retorna si es
    correcto o no */
  static descifrarToken(token) {
    try {
      if (!token) {
        return {
          status: "error",
          message: "Error, token vacío...",
        };
      }

      const descifrada = jsonwebtoken.verify(token, process.env.JWT_SECRET);

      // Validar que todos los campos esperados estén presentes
      if (!descifrada || !descifrada.correo || !descifrada.rol) {
        return {
          status: "error",
          message: "Token inválido o incompleto...",
          isValido: false,
        };
      }

      // Respuesta exitosa
      return {
        status: "ok",
        numero: 1,
        message: "Token válido...",
        isValido: true,
        correo: descifrada.correo,
        id_rol: descifrada.rol,
      };
    } catch (error) {
      console.error("Error al descifrar el token:", error.message);
      return {
        status: "error",
        message:
          error.name === "TokenExpiredError"
            ? "Token expirado..."
            : "Token incorrecto...",
        isValido: false,
      };
    }
  }
}
