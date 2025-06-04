import bcryptjs from "bcryptjs";

export default class CifrarDescifrarClaves {
  static async cifrarClave(clave) {
    try {
      const encriptado = await bcryptjs.genSalt(5);
      const claveEncriptada = await bcryptjs.hash(clave, encriptado);

      return {
        status: "ok",
        message: "Clave encriptada con exito...",
        claveEncriptada: claveEncriptada,
      };
    } catch (error) {
      console.log("Error, al encriptar clave: " + error);
      return {
        status: "error",
        message: "Error, al encriptar clave...",
      };
    }
  }

  static async compararClave(clave, claveGuardada) {
    try {
      const comparada = await bcryptjs.compare(clave, claveGuardada);

      if (!comparada) {
        return {
          status: "error",
          message: "Error, credenciales invalidas...",
        };
      } else {
        return {
          status: "ok",
          message: "Claves verificadas con éxito...",
        };
      }
    } catch (error) {
      console.log("Error, al comparar clave: " + error);
      return {
        status: "error",
        message: "Error interno al comparar claves...",
      };
    }
  }
}
