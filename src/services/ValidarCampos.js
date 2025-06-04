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

  static validarCamposRegistroDepartamento(nombre, descripcion, alias) {
    try {
      // Validar que nombre, descripción y alias no estén vacíos
      if (!nombre) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNombre.campoVacio
        );
      }

      if (!descripcion) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorDescripcion.campoVacio
        );
      }

      if (!alias) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorAlias.campoVacio
        );
      }

      if (!nombreRegex.test(alias)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorAlias.formatoInvalido
        );
      }

      const nombreMinuscula = nombre.toLowerCase();

      return retornarRespuestaFunciones(msjCorrectos.ok, msjCorrectos.okMixto, {
        nombre: nombreMinuscula,
      });
    } catch (error) {
      console.log(`${msjErrores.errorMixto}: `, error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorMixto
      );
    }
  }

  static validarCamposEstante(nombre, descripcion, niveles, secciones, alias) {
    try {
      // Validar que nombre, descripción y alias no estén vacíos
      if (!nombre) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNombre.campoVacio
        );
      }

      if (!descripcion) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorDescripcion.campoVacio
        );
      }

      // Validar que niveles y secciones sean números positivos
      if (!niveles) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNiveles.campoVacio
        );
      }

      const nivel = Number(niveles);

      if (typeof nivel !== "number") {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNiveles.formatoInvalido
        );
      }

      if (nivel < 1) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNiveles.menorCero
        );
      }

      if (typeof nivel !== "number" || nivel <= 0) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNiveles.numeroPositivo
        );
      }

      if (!secciones) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorSecciones.campoVacio
        );
      }

      const seccion = Number(secciones);

      if (typeof seccion !== "number") {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorSecciones.formatoInvalido
        );
      }

      if (typeof seccion !== "number" || seccion <= 0) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorSecciones.numeroPositivo
        );
      }

      if (!alias) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorAlias.campoVacio
        );
      }

      if (!nombreRegex.test(alias)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorAlias.formatoInvalido
        );
      }

      const nombreMinuscula = nombre.toLowerCase();

      return retornarRespuestaFunciones(msjCorrectos.ok, msjCorrectos.okMixto, {
        secciones: seccion,
        niveles: nivel,
        nombre: nombreMinuscula,
      });
    } catch (error) {
      console.log(`${msjErrores.errorMixto}: `, error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorMixto
      );
    }
  }

  static validarCamposCarpeta(
    nombre,
    descripcion,
    nivel,
    seccion,
    alias,
    id_usuario,
    id_departamento,
    id_estante
  ) {
    try {
      const usuario_id = Number(id_usuario);
      const departamento_id = Number(id_departamento);
      const estante_id = Number(id_estante);
      // Validar que nombre, descripción y alias no estén vacíos
      if (!nombre) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNombre.campoVacio
        );
      }

      if (!descripcion) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorDescripcion.campoVacio
        );
      }

      // Validar que niveles y secciones sean números positivos
      if (nivel < 0) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNiveles.campoVacio
        );
      }

      const niveles = Number(nivel);

      if (typeof niveles !== "number") {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNiveles.formatoInvalido
        );
      }

      if (niveles < 0) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNiveles.menorCero
        );
      }

      if (typeof niveles !== "number" || niveles < 0) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNiveles.numeroPositivo
        );
      }

      if (!seccion) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorSecciones.campoVacio
        );
      }

      const secciones = Number(seccion);

      if (typeof secciones !== "number") {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorSecciones.formatoInvalido
        );
      }

      if (typeof secciones !== "number" || secciones <= 0) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorSecciones.numeroPositivo
        );
      }

      if (!alias) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorAlias.campoVacio
        );
      }

      if (!nombreRegex.test(alias)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorAlias.formatoInvalido
        );
      }

      return retornarRespuestaFunciones(msjCorrectos.ok, msjCorrectos.okMixto, {
        seccion: secciones,
        nivel: niveles,
        id_usuario: usuario_id,
        id_departamento: departamento_id,
        id_estante: estante_id,
      });
    } catch (error) {
      console.log(`${msjErrores.errorMixto}: `, error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorMixto
      );
    }
  }

  static validarCamposArchivo(
    archivo,
    nombre,
    descripcion,
    alias,
    id_usuario,
    id_departamento,
    id_estante,
    id_carpeta
  ) {
    try {
      const usuario_id = Number(id_usuario);
      const departamento_id = Number(id_departamento);
      const estante_id = Number(id_estante);
      const carpeta_id = Number(id_carpeta);

      // Validar que nombre, descripción y alias no estén vacíos
      if (!nombre) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorNombre.campoVacio
        );
      }

      const nombreMinuscula = nombre.toLowerCase();

      if (!archivo) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorArchivo.campoVacio
        );
      }

      if (!descripcion) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorDescripcion.campoVacio
        );
      }

      if (!alias) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorAlias.campoVacio
        );
      }

      if (!nombreRegex.test(alias)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorAlias.formatoInvalido
        );
      }

      return retornarRespuestaFunciones(msjCorrectos.ok, msjCorrectos.okMixto, {
        nombreArchivo: nombreMinuscula,
        id_usuario: usuario_id,
        id_departamento: departamento_id,
        id_estante: estante_id,
        id_carpeta: carpeta_id,
      });
    } catch (error) {
      console.log(`${msjErrores.errorMixto}: `, error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorMixto
      );
    }
  }
}
