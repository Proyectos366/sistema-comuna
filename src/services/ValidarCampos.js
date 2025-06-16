import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import msjErrores from "../msj_validaciones/campos_formulario/msjErrores.json";
import msjCorrectos from "../msj_validaciones/campos_formulario/msjCorrectos.json";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const claveRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;
const cedulaRegex = /^[1-9]\d{5,7}$/;
const nombreRegex = /^[a-zA-ZñÑ\s]+$/;

export default class ValidarCampos {
  static validarCampoCorreo(correo) {
    try {
      if (!correo) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorCorreo.campoVacio
        );
      }

      if (!emailRegex.test(correo)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorCorreo.formatoInvalido
        );
      }

      return retornarRespuestaFunciones(
        msjCorrectos.ok,
        msjCorrectos.okCorreo.campoValido
      );
    } catch (error) {
      console.log(`${msjErrores.errorCorreo.internoValidando}: ` + error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorCorreo.internoValidando
      );
    }
  }

  static validarCampoNombre(nombre) {
    try {
      if (!nombre) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNombre.campoVacio
        );
      }

      if (!nombreRegex.test(nombre)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNombre.formatoInvalido
        );
      }

      return retornarRespuestaFunciones(
        msjCorrectos.ok,
        msjCorrectos.okNombre.campoValido
      );
    } catch (error) {
      console.log(`${msjErrores.errorNombre.internoValidando}: ` + error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorNombre.internoValidando
      );
    }
  }

  static validarCampoNombreApellidoDos(nombre, opcion) {
    try {
      if (nombre) {
        if (!nombreRegex.test(nombre)) {
          return retornarRespuestaFunciones(
            "error",
            `Error, segundo ${
              opcion === "apellido" ? "apellido" : "nombre"
            } solo letras`
          );
        }
      }

      return retornarRespuestaFunciones(
        "ok",
        `Campo segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        } valido...`
      );
    } catch (error) {
      console.log(
        `Error, interno validando segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        }: ` + error
      );
      return retornarRespuestaFunciones(
        "error",
        `Error, interno validadndo segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        }...`
      );
    }
  }

  static validarCampoCedula(cedula) {
    try {
      if (!cedula) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorCedula.campoVacio
        );
      }

      if (!cedulaRegex.test(cedula)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorCedula.formatoInvalido
        );
      }

      return retornarRespuestaFunciones(
        msjCorrectos.ok,
        msjCorrectos.okCedula.campoValido
      );
    } catch (error) {
      console.log(`${msjErrores.errorCedula.internoValidando}: ` + error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorCedula.internoValidando
      );
    }
  }

  static validarCampoClave(claveUno, claveDos) {
    try {
      if (!claveUno) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorClave.campoVacio
        );
      }

      if (!claveDos) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorClave.campoVacioConfirmar
        );
      }

      if (claveUno !== claveDos) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorClave.clavesNoCoinciden
        );
      }

      if (!claveRegex.test(claveUno)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorClave.formatoInvalido
        );
      }

      return retornarRespuestaFunciones(
        msjCorrectos.ok,
        msjCorrectos.okClave.campoValido
      );
    } catch (error) {
      console.log(`${msjErrores.errorClave.internoValidando}: ` + error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorCorreo.internoValidando
      );
    }
  }

  static validarCampoGenero(genero) {
    try {
      const moduloNumero = Number(genero);

      if (isNaN(moduloNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo genero invalido..."
        );
      }

      if (!Number.isInteger(moduloNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo genero invalido..."
        );
      }

      if (!genero) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo genero vacio..."
        );
      }

      if (!(genero === 1 || genero === 2 || genero === "1" || genero === "2")) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo debe ser hombre o mujer..."
        );
      }

      return retornarRespuestaFunciones("ok", "Campo genero validado...");
    } catch (error) {
      console.log(`Error, interno validando genero: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando genero..."
      );
    }
  }

  static validarCamposRegistro(cedula, nombre, correo, claveUno, claveDos) {
    try {
      const validarCorreo = this.validarCampoCorreo(correo);

      if (!cedula) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorCedula.campoVacio
        );
      }

      if (!cedulaRegex.test(cedula)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorCedula.formatoInvalido
        );
      }

      if (!nombre) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNombre.campoVacio
        );
      }

      if (!nombreRegex.test(nombre)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNombre.formatoInvalido
        );
      }

      if (validarCorreo.status === "error") return validarCorreo;

      const validarClave = this.validarCampoClave(claveUno, claveDos);
      if (validarClave.status === "error") return validarClave;

      return retornarRespuestaFunciones(msjCorrectos.ok, "Campos validados...");
    } catch (error) {
      console.log(`${msjErrores.errorMixto}: ` + error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorMixto
      );
    }
  }

  static validarCamposLogin(correo, clave) {
    try {
      const validarCorreo = this.validarCampoCorreo(correo);

      if (validarCorreo.status === "error") return validarCorreo;

      if (!clave) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorClave.campoVacio
        );
      }

      return retornarRespuestaFunciones(msjCorrectos.ok, msjCorrectos.okMixto);
    } catch (error) {
      console.log(`${msjErrores.errorLogin}: `, error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorLogin
      );
    }
  }

  static validarCamposRegistroVocero(
    nombre,
    nombre_dos,
    apellido,
    apellido_dos,
    cedula,
    correo,
    genero,
    edad
  ) {
    try {
      const validarCorreo = this.validarCampoCorreo(correo);
      const validarNombre = this.validarCampoNombre(nombre);
      const validarNombreDos = this.validarCampoNombreApellidoDos(
        nombre_dos,
        "nombre"
      );
      const validarApellido = this.validarCampoNombre(apellido);
      const validarApellidoDos = this.validarCampoNombreApellidoDos(
        apellido_dos,
        "apellido"
      );
      const validarCedula = this.validarCampoCedula(cedula);
      const validarGenero = this.validarCampoGenero(genero);

      if (validarCorreo.status === "error") return validarCorreo;
      if (validarNombre.status === "error") return validarNombre;
      if (validarNombreDos.status === "error") return validarNombreDos;
      if (validarApellido.status === "error") return validarApellido;
      if (validarApellidoDos.status === "error") return validarApellidoDos;
      if (validarCedula.status === "error") return validarCedula;
      if (validarGenero.status === "error") return validarGenero;

      if (!edad) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo edad vacio..."
        );
      }

      return retornarRespuestaFunciones("ok", "Campos validados...");
    } catch (error) {
      console.log(`Error, interno validando campos vocero: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos vocero..."
      );
    }
  }

  static validarCamposCrearFormacion(nombre, modulos) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);

      if (validarNombre.status === "error") return validarNombre;

      if (!modulos) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo modulos vacio..."
        );
      }
      const moduloNumero = Number(modulos);

      if (isNaN(moduloNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo modulo debe ser un numero..."
        );
      }

      if (!Number.isInteger(moduloNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, debe ser unnumero entero..."
        );
      }

      if (moduloNumero < 1) {
        return retornarRespuestaFunciones("error", "Error, minimo 1 modulo...");
      }

      const MAX_MODULOS = 3;

      if (moduloNumero > MAX_MODULOS) {
        return retornarRespuestaFunciones(
          "error",
          `Error, maximo ${MAX_MODULOS} módulos`
        );
      }

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        cantidadModulos: moduloNumero,
      });
    } catch (error) {
      console.log(`Error, interno validando campos formaciones: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos formaciones..."
      );
    }
  }
}
