import retornarRespuestaFunciones from "@/utils/respuestasValidaciones";
import msjErrores from "../msj_validaciones/campos_formulario/msjErrores.json";
import msjCorrectos from "../msj_validaciones/campos_formulario/msjCorrectos.json";
import { quitarCaracteres } from "@/utils/quitarCaracteres";
import { phoneRegex } from "@/utils/constantes";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const claveRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;
const cedulaRegex = /^[1-9]\d{5,7}$/;
const nombreRegex = /^[a-zA-ZñÑ\s]+$/;
const rifRegex = /^[VEJPGCL]-\d{8}-\d$/;

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

      const correoLetrasMinusculas = correo.toLowerCase();

      return retornarRespuestaFunciones(
        msjCorrectos.ok,
        msjCorrectos.okCorreo.campoValido,
        {
          correo: correoLetrasMinusculas,
        }
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

      const nombreLetrasMinusculas = nombre.toLowerCase();

      return retornarRespuestaFunciones(
        msjCorrectos.ok,
        msjCorrectos.okNombre.campoValido,
        {
          nombre: nombreLetrasMinusculas,
        }
      );
    } catch (error) {
      console.log(`${msjErrores.errorNombre.internoValidando}: ` + error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorNombre.internoValidando
      );
    }
  }

  static validarCampoTexto(texto) {
    try {
      if (!texto) {
        return retornarRespuestaFunciones("error", "Error, campo vacio...");
      }

      const textoLetrasMinusculas = texto.toLowerCase();

      return retornarRespuestaFunciones("ok", "Campo valido...", {
        texto: textoLetrasMinusculas,
      });
    } catch (error) {
      console.log(`Error, interno validar campo texto: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validar campo texto..."
      );
    }
  }

  static validarCampoCodigoPostal(codigoPostal) {
    try {
      if (!codigoPostal) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo codigo postal vacio..."
        );
      }

      const textoLetrasMinusculas = codigoPostal.toLowerCase();

      return retornarRespuestaFunciones("ok", "Campo valido...", {
        codigoPostal: textoLetrasMinusculas,
      });
    } catch (error) {
      console.log(`Error, interno validar campo codigo postal: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validar campo codigo postal..."
      );
    }
  }

  static validarCampoNombreApellidoDos(nombre, opcion) {
    try {
      if (nombre && !nombreRegex.test(nombre)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, segundo ${
            opcion === "apellido" ? "apellido" : "nombre"
          } solo letras`
        );
      }

      const campo =
        opcion === "apellido"
          ? { apellido_dos: nombre ? nombre.toLowerCase() : "" }
          : { nombre_dos: nombre ? nombre.toLowerCase() : "" };

      return retornarRespuestaFunciones(
        "ok",
        `Campo segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        } valido...`,
        campo
      );
    } catch (error) {
      console.log(
        `Error interno validando segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        }: ` + error
      );
      return retornarRespuestaFunciones(
        "error",
        `Error interno validando segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        }...`
      );
    }
  }

  static validarCampoCedula(cedula) {
    try {
      if (!cedula) {
        return retornarRespuestaFunciones("error", "Campo cedula vacio...");
      }

      const cedulaLimpia = quitarCaracteres(cedula);

      const cedulaNumero = Number(cedulaLimpia);

      if (isNaN(cedulaNumero)) {
        // Si es NaN, o si es 0 o negativo (que no suelen ser edades válidas)
        return retornarRespuestaFunciones("error", "Error, cedula inválida...");
      }

      // Opcional: Rango de cedula (ej. no más de 120 años)
      if (cedulaNumero.length < 7 || cedulaNumero.length > 8) {
        return retornarRespuestaFunciones(
          "error",
          "Error, cedula incorrecta...."
        );
      }

      if (!cedulaRegex.test(cedulaNumero)) {
        return retornarRespuestaFunciones(
          msjErrores.error,
          msjErrores.errorCedula.formatoInvalido
        );
      }

      return retornarRespuestaFunciones(
        msjCorrectos.ok,
        msjCorrectos.okCedula.campoValido,
        { cedula: cedulaNumero }
      );
    } catch (error) {
      console.log(`${msjErrores.errorCedula.internoValidando}: ` + error);
      return retornarRespuestaFunciones(
        msjErrores.error,
        msjErrores.errorCedula.internoValidando
      );
    }
  }

  static validarCampoTelefono(telefono) {
    try {
      if (!telefono) {
        return retornarRespuestaFunciones("error", "Campo teléfono vacio...");
      }

      const telefonoLimpio = quitarCaracteres(telefono);

      if (!phoneRegex.test(telefonoLimpio)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato invalido..."
        );
      }

      return retornarRespuestaFunciones("ok", "Campo teléfono valido...", {
        telefono: telefonoLimpio,
      });
    } catch (error) {
      console.log(`Error, interno al validar telefono: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno (validar telefono)"
      );
    }
  }

  static validarCampoEdad(edad) {
    try {
      if (!edad) {
        return retornarRespuestaFunciones("error", "Campo edad vacio...");
      }

      const edadNumero = Number(edad);

      if (isNaN(edadNumero) || edadNumero <= 0) {
        // Si es NaN, o si es 0 o negativo (que no suelen ser edades válidas)
        return retornarRespuestaFunciones("error", "Error, edad inválida...");
      }

      // Opcional: Rango de edad (ej. no más de 120 años)
      if (edadNumero > 99) {
        return retornarRespuestaFunciones("error", "Error, edad muy alta....");
      }

      if (edadNumero < 18) {
        return retornarRespuestaFunciones(
          "error",
          "Error, es un menor de edad...."
        );
      }

      return retornarRespuestaFunciones("ok", "Campo edad valido...", {
        edad: edadNumero,
      });
    } catch (error) {
      console.log(`Error, interno al (validar edad): ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno (validar edad)"
      );
    }
  }

  static validarCampoId(id, detalles) {
    try {
      if (!id) {
        return retornarRespuestaFunciones(
          "error",
          `Campo id ${detalles} vacio...`
        );
      }

      const idNumero = Number(id);

      if (isNaN(idNumero) || idNumero <= 0) {
        // Si es NaN, o si es 0 o negativo (que no suelen ser ides válidas)
        return retornarRespuestaFunciones(
          "error",
          `Error, id ${detalles} inválido...`
        );
      }

      return retornarRespuestaFunciones(
        "ok",
        `Campo id ${detalles} valido...`,
        {
          id: idNumero,
        }
      );
    } catch (error) {
      console.log(`Error, interno al (validar id ${detalles}): ` + error);
      return retornarRespuestaFunciones(
        "error",
        `Error, interno al (validar id ${detalles})`
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
        msjCorrectos.okClave.campoValido,
        {
          claveUno: claveUno,
          claveDos: claveDos,
        }
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
      const generoNumero = Number(genero);

      if (isNaN(generoNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo genero invalido..."
        );
      }

      if (!Number.isInteger(generoNumero)) {
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

      return retornarRespuestaFunciones("ok", "Campo genero validado...", {
        genero: generoNumero === 1 ? true : false,
      });
    } catch (error) {
      console.log(`Error, interno validando genero: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando genero..."
      );
    }
  }

  static validarCampoNumeroPasarBoolean(numero, opcion) {
    try {
      const numeroPasarBoolean = Number(numero);

      if (!numero) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} vacio...`
        );
      }

      if (isNaN(numeroPasarBoolean)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} invalido...`
        );
      }

      if (!Number.isInteger(numeroPasarBoolean)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} debe ser entero...`
        );
      }

      if (!(numero === 1 || numero === 2 || numero === "1" || numero === "2")) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} deber ser 1 o 2...`
        );
      }

      return retornarRespuestaFunciones("ok", `Campo ${opcion} valido...`, {
        boolean: numeroPasarBoolean === 1 ? true : false,
      });
    } catch (error) {
      console.log(`Error, interno validando ${opcion}: ` + error);
      return retornarRespuestaFunciones(
        "error",
        `Error, interno validando ${opcion}`
      );
    }
  }

  static validarCampoFechaISO(fecha) {
    try {
      if (!fecha) {
        return retornarRespuestaFunciones("error", "Campo fecha vacio...");
      }

      // Formato ISO 8601: "YYYY-MM-DDTHH:MM:SSZ"
      const formatoISO =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(Z)?$/;
      if (!formatoISO.test(fecha)) {
        return retornarRespuestaFunciones(
          "error",
          "Formato de fecha invalido..."
        );
      }

      const fechaConvertida = new Date(fecha);
      if (isNaN(fechaConvertida.getTime())) {
        return retornarRespuestaFunciones(
          "error",
          "No se puede interpretar la fecha..."
        );
      }

      const ahora = new Date();
      const fechaMinima = new Date("1900-01-01T00:00:00Z"); // ajustable si necesitas otro límite

      if (fechaConvertida > ahora) {
        return retornarRespuestaFunciones(
          "error",
          "Fecha no puede pasar el dia actual..."
        );
      }

      if (fechaConvertida < fechaMinima) {
        return retornarRespuestaFunciones("error", "Fecha muy antigua...");
      }

      return retornarRespuestaFunciones(
        "ok",
        "Campo fecha validada con exito...",
        { fecha: fechaConvertida }
      );
    } catch (error) {
      console.log(`Error, interno validando fecha: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando fecha..."
      );
    }
  }

  static validarCampoModulo(modulo) {
    try {
      if (!modulo) {
        return retornarRespuestaFunciones("error", "Campo modulo vacio...");
      }

      const moduloNumero = Number(modulo);

      if (isNaN(moduloNumero) || moduloNumero <= 0) {
        // Si es NaN, o si es 0 o negativo (que no suelen ser ides válidas)
        return retornarRespuestaFunciones("error", "Error, modulo inválido...");
      }

      if (!Number.isInteger(moduloNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, debe ser un número entero..."
        );
      }

      if (moduloNumero < 1) {
        return retornarRespuestaFunciones("error", "Error, minimo 1 modulo...");
      }

      const MAX_MODULOS = 9;

      if (moduloNumero > MAX_MODULOS) {
        return retornarRespuestaFunciones(
          "error",
          `Error, maximo ${MAX_MODULOS} módulos`
        );
      }

      return retornarRespuestaFunciones("ok", "Campo modulo valido...", {
        modulo: moduloNumero,
      });
    } catch (error) {
      console.log(`Error, interno al (validar modulo): ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno (validar modulo)"
      );
    }
  }

  static validarCampoRif(rif) {
    try {
      if (!rif) {
        return retornarRespuestaFunciones("error", "Campo RIF vacío...");
      }

      // Limpia el RIF: elimina espacios y lo convierte a mayúsculas
      const rifLimpio = rif.trim().toUpperCase();

      // Regex para validar formato: letra-8dígitos-dígito

      if (!rifRegex.test(rifLimpio)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato de RIF inválido..."
        );
      }

      // Validación del dígito verificador según SENIAT
      const letra = rifLimpio.charAt(0);
      const cuerpo = rifLimpio.slice(2, 10); // 8 dígitos
      const digitoOriginal = parseInt(rifLimpio.slice(-1), 10);

      const valoresLetra = {
        V: 1,
        E: 2,
        J: 3,
        P: 4,
        G: 5,
        C: 6,
        L: 7,
      };

      const pesos = [4, 3, 2, 7, 6, 5, 4, 3, 2];

      if (!valoresLetra[letra]) {
        return retornarRespuestaFunciones(
          "error",
          "Error, letra de RIF inválida..."
        );
      }

      const rifNumerico = [
        valoresLetra[letra],
        ...cuerpo.split("").map(Number),
      ];

      const suma = rifNumerico.reduce((acc, num, i) => acc + num * pesos[i], 0);
      const resto = suma % 11;
      const digitoCalculado = resto < 2 ? resto : 11 - resto;

      if (digitoCalculado !== digitoOriginal) {
        return retornarRespuestaFunciones(
          "error",
          "Error, dígito verificador incorrecto según SENIAT"
        );
      }

      return retornarRespuestaFunciones("ok", "RIF válido.", {
        rif: rifLimpio,
      });
    } catch (error) {
      console.log(`Error interno validando campo RIF: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno validando campo RIF"
      );
    }
  }

  static validarCampoRango(rango, detalles) {
    try {
      if (!rango) {
        return retornarRespuestaFunciones(
          "error",
          `Campo ${detalles} vacio...`
        );
      }

      const numero = Number(rango);

      if (isNaN(numero) || numero <= 0) {
        // Si es NaN, o si es 0 o negativo (que no suelen ser ides válidas)
        return retornarRespuestaFunciones(
          "error",
          `Error, ${detalles} inválido...`
        );
      }

      return retornarRespuestaFunciones("ok", `Campo ${detalles} valido...`, {
        rango: numero,
      });
    } catch (error) {
      console.log(`Error, interno al (validar ${detalles}): ` + error);
      return retornarRespuestaFunciones(
        "error",
        `Error, interno al (validar ${detalles})`
      );
    }
  }

  static validarCamposRegistro(
    cedula,
    nombre,
    apellido,
    correo,
    claveUno,
    claveDos,
    id_rol,
    autorizar
  ) {
    try {
      const validarCorreo = this.validarCampoCorreo(correo);
      const validarCedula = this.validarCampoCedula(cedula);
      const validarNombre = this.validarCampoNombre(nombre);
      const validarApellido = this.validarCampoNombre(apellido);
      const validarClave = this.validarCampoClave(claveUno, claveDos);
      const validarIdRol = this.validarCampoId(id_rol);
      const validarAutorizar = this.validarCampoNumeroPasarBoolean(
        autorizar,
        "autorizar"
      );

      if (validarCedula.status === "error") return validarCedula;
      if (validarNombre.status === "error") return validarNombre;
      if (validarApellido.status === "error") return validarApellido;
      if (validarCorreo.status === "error") return validarCorreo;
      if (validarClave.status === "error") return validarClave;
      if (validarIdRol.status === "error") return validarIdRol;
      if (validarAutorizar.status === "error") return validarAutorizar;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        cedula: validarCedula.cedula,
        nombre: validarNombre.nombre,
        apellido: validarApellido.nombre,
        correo: validarCorreo.correo,
        claveUno: validarClave.claveUno,
        claveDos: validarClave.claveDos,
        id_rol: validarIdRol.id,
        autorizar: validarAutorizar.boolean,
      });
    } catch (error) {
      console.log(`Error interno, validar campos registro usuario: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno campos usuario"
      );
    }
  }

  static validarCamposCrearPais(nombre, capital, descripcion, serial) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarCapital = this.validarCampoNombre(capital);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarSerial = this.validarCampoTexto(serial);

      if (validarNombre.status === "error") return validarNombre;
      if (validarCapital.status === "error") return validarCapital;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarSerial.status === "error") return validarSerial;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        capital: validarCapital.nombre,
        descripcion: validarDescripcion.texto,
        serial: validarSerial.texto,
      });
    } catch (error) {
      console.log(`Error interno crear pais: ` + error);
      return retornarRespuestaFunciones("error", "Error interno crear pais");
    }
  }

  static validarCamposCrearEstado(
    nombre,
    capital,
    codigoPostal,
    descripcion,
    id_pais
  ) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarCapital = this.validarCampoNombre(capital);
      const validarCodigoPostal = this.validarCampoCodigoPostal(codigoPostal);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);

      if (validarNombre.status === "error") return validarNombre;
      if (validarCapital.status === "error") return validarCapital;
      if (validarCodigoPostal.status === "error") return validarCodigoPostal;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        capital: validarCapital.nombre,
        codigoPostal: validarCodigoPostal.codigoPostal,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
      });
    } catch (error) {
      console.log(`Error interno crear estado: ` + error);
      return retornarRespuestaFunciones("error", "Error interno crear estado");
    }
  }

  static validarCamposCrearMunicipio(nombre, descripcion, id_pais, id_estado) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);
      const validarIdEstado = this.validarCampoId(id_estado);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos municipio crear: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos municipio crear..."
      );
    }
  }

  static validarCamposCrearParroquia(
    nombre,
    descripcion,
    id_pais,
    id_estado,
    id_municipio
  ) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);
      const validarIdEstado = this.validarCampoId(id_estado);
      const validarIdMunicipio = this.validarCampoId(id_municipio);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;
      if (validarIdMunicipio.status === "error") return validarIdMunicipio;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
        id_municipio: validarIdMunicipio.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos parroquia crear: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos parroquia crear..."
      );
    }
  }

  static validarCamposCrearInstitucion(
    nombre,
    descripcion,
    rif,
    sector,
    direccion,
    id_pais,
    id_estado,
    id_municipio,
    id_parroquia
  ) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarRif = this.validarCampoRif(rif);
      const validarSector = this.validarCampoTexto(sector);
      const validarDireccion = this.validarCampoTexto(direccion);
      const validarIdPais = this.validarCampoId(id_pais, "pais");
      const validarIdEstado = this.validarCampoId(id_estado, "estado");
      const validarIdMunicipio = this.validarCampoId(id_municipio, "municipio");
      const validarIdParroquia = this.validarCampoId(id_parroquia, "parroquia");

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarRif.status === "error") return validarRif;
      if (validarSector.status === "error") return validarSector;
      if (validarDireccion.status === "error") return validarDireccion;

      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;
      if (validarIdMunicipio.status === "error") return validarIdMunicipio;
      if (validarIdParroquia.status === "error") return validarIdParroquia;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        rif: validarRif.rif,
        sector: validarSector.texto,
        direccion: validarDireccion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
        id_municipio: validarIdMunicipio.id,
        id_parroquia: validarIdParroquia.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos institucion: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos institucion..."
      );
    }
  }

  static validarCamposCrearDepartamento(nombre, descripcion) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
      });
    } catch (error) {
      console.log(`Error, interno validando campos departamento: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos departamento..."
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

  static validarCamposCrearComuna(nombre, usuarioId, parroquiaId) {
    try {
      const validarNombre = this.validarCampoTexto(nombre);
      const validarUsuarioId = this.validarCampoId(usuarioId);
      const validarParroquiaId = this.validarCampoId(parroquiaId);

      if (validarNombre.status === "error") return validarNombre;
      if (validarUsuarioId.status === "error") return validarUsuarioId;
      if (validarParroquiaId.status === "error") return validarParroquiaId;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.texto,
        id_usuario: validarUsuarioId.id,
        id_parroquia: validarParroquiaId.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos vocero: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos vocero..."
      );
    }
  }

  static validarCamposCrearConsejoComunal(
    nombre,
    usuarioId,
    parroquiaId,
    comunaId,
    circuitoId,
    comunaCircuito
  ) {
    try {
      const validaciones = {
        nombre: this.validarCampoTexto(nombre),
        id_usuario: this.validarCampoId(usuarioId),
        id_parroquia: this.validarCampoId(parroquiaId),
      };

      if (validaciones.nombre.status === "error") return validaciones.nombre;
      if (validaciones.id_usuario.status === "error")
        return validaciones.id_usuario;
      if (validaciones.id_parroquia.status === "error")
        return validaciones.id_parroquia;

      // Validar solo el ID activo (comuna o circuito)
      let id_comuna = null;
      let id_circuito = null;

      if (comunaCircuito === "comuna") {
        const result = this.validarCampoId(comunaId);
        if (result.status === "error") return result;
        id_comuna = result.id;
      } else if (comunaCircuito === "circuito") {
        const result = this.validarCampoId(circuitoId);
        if (result.status === "error") return result;
        id_circuito = result.id;
      }

      return retornarRespuestaFunciones(
        "ok",
        "Campos validados correctamente...",
        {
          nombre: validaciones.nombre.texto,
          id_usuario: validaciones.id_usuario.id,
          id_parroquia: validaciones.id_parroquia.id,
          id_comuna: id_comuna,
          id_circuito: id_circuito,
        }
      );
    } catch (error) {
      console.error("Error interno al validar campos del consejo:", error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno al validar los campos del consejo..."
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
    edad,
    telefono,
    direccion,
    laboral,
    id_parroquia,
    id_comuna,
    id_consejo,
    id_circuito
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

      const validarEdad = this.validarCampoEdad(edad);
      const validarTelefono = this.validarCampoTelefono(telefono);

      const validarActividadLaboral = this.validarCampoNombre(laboral);
      const validarDireccion = this.validarCampoTexto(
        direccion ? direccion : "sin direccion"
      );

      const validarParroquia = this.validarCampoId(id_parroquia);
      const validarComuna = id_comuna
        ? this.validarCampoId(id_comuna)
        : { id: null };
      const validarCircuito = id_circuito
        ? this.validarCampoId(id_circuito)
        : { id: null };
      const validarConsejo = id_consejo
        ? this.validarCampoId(id_consejo)
        : { id: null };

      if (validarCorreo.status === "error") return validarCorreo;
      if (validarNombre.status === "error") return validarNombre;
      if (validarNombreDos.status === "error") return validarNombreDos;
      if (validarApellido.status === "error") return validarApellido;
      if (validarApellidoDos.status === "error") return validarApellidoDos;
      if (validarCedula.status === "error") return validarCedula;
      if (validarGenero.status === "error") return validarGenero;
      if (validarEdad.status === "error") return validarEdad;
      if (validarTelefono.status === "error") return validarTelefono;
      if (validarActividadLaboral.status === "error")
        return validarActividadLaboral;
      if (validarDireccion.status === "error") return validarDireccion;
      if (validarParroquia.status === "error") return validarParroquia;

      if (validarComuna && validarComuna.status === "error")
        return validarComuna;
      if (validarCircuito && validarCircuito.status === "error")
        return validarCircuito;
      if (validarConsejo && validarConsejo.status === "error")
        return validarConsejo;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        cedula: validarCedula.cedula,
        edad: validarEdad.edad,
        nombre: validarNombre.nombre,
        nombre_dos: validarNombreDos.nombre_dos,
        apellido: validarApellido.nombre,
        apellido_dos: validarApellidoDos.apellido_dos,
        genero: validarGenero.genero,
        telefono: validarTelefono.telefono,
        correo: validarCorreo.correo,
        laboral: validarActividadLaboral.nombre,
        direccion: validarDireccion.texto,
        id_parroquia: validarParroquia.id,
        id_comuna: validarComuna.id,
        id_circuito: validarCircuito.id,
        id_consejo: validarConsejo.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos vocero: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos vocero..."
      );
    }
  }

  static validarCamposCrearFormacion(nombre, modulos, descripcion) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarModulo = this.validarCampoModulo(modulos);
      const validarDescripcion = this.validarCampoTexto(descripcion);

      if (validarNombre.status === "error") return validarNombre;
      if (validarModulo.status === "error") return validarModulo;
      if (validarDescripcion.status === "error") return validarDescripcion;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        cantidadModulos: validarModulo.modulo,
        descripcion: validarDescripcion.texto,
      });
    } catch (error) {
      console.log(`Error, interno validando campos formaciones: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos formaciones..."
      );
    }
  }

  static validarCamposCrearCargo(nombre, descripcion) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
      });
    } catch (error) {
      console.log(`Error interno crear cargo: ` + error);
      return retornarRespuestaFunciones("error", "Error interno crear cargo");
    }
  }

  static validarCamposCrearNovedad(
    nombre,
    descripcion,
    id_institucion,
    id_departamento,
    rango,
    prioridad
  ) {
    try {
      let validarId;

      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarRango = this.validarCampoRango(rango);
      const validarPrioridad = this.validarCampoRango(prioridad, "prioridad");

      if (validarRango.rango === 1) {
        validarId = this.validarCampoId(id_institucion, "institucion");
      } else {
        validarId = this.validarCampoId(id_departamento, "departamento");
      }

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarId.status === "error") return validarId;
      if (validarPrioridad.status === "error") return validarPrioridad;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        rango: validarRango.rango,
        prioridad: validarPrioridad.rango,
        id_institucion: validarRango.rango === 1 ? validarId.id : null,
        id_departamento: validarRango.rango === 1 ? null : validarId.id,
      });
    } catch (error) {
      console.log(`Error interno crear novedad: ` + error);
      return retornarRespuestaFunciones("error", "Error interno crear novedad");
    }
  }

  static validarCamposEditarPais(nombre, capital, descripcion, id_pais) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarCapital = this.validarCampoNombre(capital);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);

      if (validarNombre.status === "error") return validarNombre;
      if (validarCapital.status === "error") return validarCapital;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        capital: validarCapital.nombre,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos pais editar: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos pais editar..."
      );
    }
  }

  static validarCamposEditarEstado(
    nombre,
    capital,
    codigoPostal,
    descripcion,
    id_pais,
    id_estado
  ) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarCapital = this.validarCampoNombre(capital);
      const validarCodigoPostal = this.validarCampoCodigoPostal(codigoPostal);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);
      const validarIdEstado = this.validarCampoId(id_estado);

      if (validarNombre.status === "error") return validarNombre;
      if (validarCapital.status === "error") return validarCapital;
      if (validarCodigoPostal.status === "error") return validarCodigoPostal;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        capital: validarCapital.nombre,
        codigoPostal: validarCodigoPostal.codigo,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos estado editar: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos estado editar..."
      );
    }
  }

  static validarCamposEditarMunicipio(
    nombre,
    descripcion,
    id_pais,
    id_estado,
    id_municipio
  ) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);
      const validarIdEstado = this.validarCampoId(id_estado);
      const validarIdMunicipio = this.validarCampoId(id_municipio);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;
      if (validarIdMunicipio.status === "error") return validarIdMunicipio;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
        id_municipio: validarIdMunicipio.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos municipio editar: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos municipio editar..."
      );
    }
  }

  static validarCamposEditarParroquia(
    nombre,
    descripcion,
    id_pais,
    id_estado,
    id_municipio,
    id_parroquia
  ) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);
      const validarIdEstado = this.validarCampoId(id_estado);
      const validarIdMunicipio = this.validarCampoId(id_municipio);
      const validarIdParroquia = this.validarCampoId(id_parroquia);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;
      if (validarIdMunicipio.status === "error") return validarIdMunicipio;
      if (validarIdParroquia.status === "error") return validarIdParroquia;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
        id_municipio: validarIdMunicipio.id,
        id_parroquia: validarIdParroquia.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos parroquia editar: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos parroquia editar..."
      );
    }
  }

  static validarCamposEditarInstitucion(
    nombre,
    descripcion,
    rif,
    sector,
    direccion,
    id_pais,
    id_estado,
    id_municipio,
    id_institucion
  ) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarRif = this.validarCampoRif(rif);
      const validarSector = this.validarCampoTexto(sector);
      const validarDireccion = this.validarCampoTexto(direccion);
      const validarIdPais = this.validarCampoId(id_pais);
      const validarIdEstado = this.validarCampoId(id_estado);
      const validarIdMunicipio = this.validarCampoId(id_municipio);
      const validarIdInstitucion = this.validarCampoId(id_institucion);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarRif.status === "error") return validarRif;
      if (validarSector.status === "error") return validarSector;
      if (validarDireccion.status === "error") return validarDireccion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;
      if (validarIdMunicipio.status === "error") return validarIdMunicipio;
      if (validarIdInstitucion.status === "error") return validarIdInstitucion;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        rif: validarRif.rif,
        sector: validarSector.texto,
        direccion: validarDireccion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
        id_municipio: validarIdMunicipio.id,
        id_institucion: validarIdInstitucion.id,
      });
    } catch (error) {
      console.log(
        `Error, interno validando campos institucion editar: ` + error
      );
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos institucion editar..."
      );
    }
  }

  static validarCamposEditarVocero(
    nombre,
    nombre_dos,
    apellido,
    apellido_dos,
    cedula,
    correo,
    genero,
    edad,
    telefono,
    direccion,
    laboral,
    id_parroquia,
    id_comuna,
    id_consejo,
    id_circuito
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

      const validarEdad = this.validarCampoEdad(edad);
      const validarTelefono = this.validarCampoTelefono(telefono);

      const validarActividadLaboral = this.validarCampoNombre(laboral);
      const validarDireccion = this.validarCampoTexto(
        direccion ? direccion : "sin direccion"
      );

      const validarParroquia = this.validarCampoId(id_parroquia);
      const validarComuna = id_comuna
        ? this.validarCampoId(id_comuna)
        : { id: null };
      const validarCircuito = id_circuito
        ? this.validarCampoId(id_circuito)
        : { id: null };
      const validarConsejo = id_consejo
        ? this.validarCampoId(id_consejo)
        : { id: null };

      if (validarCorreo.status === "error") return validarCorreo;
      if (validarNombre.status === "error") return validarNombre;
      if (validarNombreDos.status === "error") return validarNombreDos;
      if (validarApellido.status === "error") return validarApellido;
      if (validarApellidoDos.status === "error") return validarApellidoDos;
      if (validarCedula.status === "error") return validarCedula;
      if (validarGenero.status === "error") return validarGenero;
      if (validarEdad.status === "error") return validarEdad;
      if (validarTelefono.status === "error") return validarTelefono;
      if (validarActividadLaboral.status === "error")
        return validarActividadLaboral;
      if (validarDireccion.status === "error") return validarDireccion;
      if (validarParroquia.status === "error") return validarParroquia;

      if (validarComuna && validarComuna.status === "error")
        return validarComuna;
      if (validarCircuito && validarCircuito.status === "error")
        return validarCircuito;
      if (validarConsejo && validarConsejo.status === "error")
        return validarConsejo;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        cedula: validarCedula.cedula,
        edad: validarEdad.edad,
        nombre: validarNombre.nombre,
        nombre_dos: validarNombreDos.nombre_dos,
        apellido: validarApellido.nombre,
        apellido_dos: validarApellidoDos.apellido_dos,
        genero: validarGenero.genero,
        telefono: validarTelefono.telefono,
        correo: validarCorreo.correo,
        laboral: validarActividadLaboral.nombre,
        direccion: validarDireccion.texto,
        id_parroquia: validarParroquia.id,
        id_comuna: validarComuna.id,
        id_circuito: validarCircuito.id,
        id_consejo: validarConsejo.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos vocero editar: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos vocero editar..."
      );
    }
  }

  static validarCamposEditarComuna(nombre, id_parroquia, id_comuna) {
    try {
      const validarNombre = this.validarCampoTexto(nombre);
      const validarParroquia = this.validarCampoId(id_parroquia);
      const validarComuna = this.validarCampoId(id_comuna);

      if (validarNombre.status === "error") return validarNombre;
      if (validarParroquia.status === "error") return validarParroquia;
      if (validarComuna.status === "error") return validarComuna;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.texto,
        id_parroquia: validarParroquia.id,
        id_comuna: validarComuna.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos comuna editar: ` + error);

      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos comuna editar..."
      );
    }
  }

  static validarCamposEditarConsejo(nombre, id_comuna, id_consejo) {
    try {
      const validarNombre = this.validarCampoTexto(nombre);
      const validarComuna = this.validarCampoId(id_comuna);
      const validarConsejo = this.validarCampoId(id_consejo);

      if (validarNombre.status === "error") return validarNombre;
      if (validarComuna.status === "error") return validarComuna;
      if (validarConsejo.status === "error") return validarConsejo;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.texto,
        id_comuna: validarComuna.id,
        id_consejo: validarConsejo.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos consejo editar: ` + error);

      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos consejo editar..."
      );
    }
  }

  static validarCamposEditarDepartamento(nombre, descripcion, id_departamento) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdDepartamento = this.validarCampoId(id_departamento);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdDepartamento.status === "error")
        return validarIdDepartamento;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_departamento: validarIdDepartamento.id,
      });
    } catch (error) {
      console.log(
        `Error, interno validando campos departamento editar: ` + error
      );
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos departamento editar..."
      );
    }
  }

  static validarCamposEditarCargo(nombre, descripcion, id_cargo) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdCargo = this.validarCampoId(id_cargo);

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdCargo.status === "error") return validarIdCargo;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_cargo: validarIdCargo.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos cargo editar: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos cargo editar..."
      );
    }
  }

  static validarCamposEditarFormacion(
    nombre,
    modulos,
    descripcion,
    id_formacion
  ) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarModulo = this.validarCampoModulo(modulos);
      const validarIdFormacion = this.validarCampoId(id_formacion);

      if (validarNombre.status === "error") return validarNombre;
      if (validarModulo.status === "error") return validarModulo;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdFormacion.status === "error") return validarIdFormacion;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        cantidadModulos: validarModulo.modulo,
        descripcion: validarDescripcion.texto,
        id_formacion: validarIdFormacion.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos formacion editar: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos formacion editar..."
      );
    }
  }

  static validarCamposEditarNovedad(nombre, descripcion, id_novedad) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdNovedad = this.validarCampoId(id_novedad, "novedad");

      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdNovedad.status === "error") return validarIdNovedad;

      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_novedad: validarIdNovedad.id,
      });
    } catch (error) {
      console.log(`Error, interno validando campos novedad editar: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos novedad editar..."
      );
    }
  }
}
