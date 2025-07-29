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

  static validarCampoId(id) {
    try {
      if (!id) {
        return retornarRespuestaFunciones("error", "Campo id vacio...");
      }

      const idNumero = Number(id);

      if (isNaN(idNumero) || idNumero <= 0) {
        // Si es NaN, o si es 0 o negativo (que no suelen ser ides válidas)
        return retornarRespuestaFunciones("error", "Error, id inválido...");
      }

      return retornarRespuestaFunciones("ok", "Campo id valido...", {
        id: idNumero,
      });
    } catch (error) {
      console.log(`Error, interno al (validar id): ` + error);
      return retornarRespuestaFunciones("error", "Error, interno (validar id)");
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

  static validarCamposRegistro(
    cedula,
    nombre,
    apellido,
    correo,
    claveUno,
    claveDos
  ) {
    try {
      const validarCorreo = this.validarCampoCorreo(correo);
      const validarCedula = this.validarCampoCedula(cedula);
      const validarNombre = this.validarCampoNombre(nombre);
      const validarApellido = this.validarCampoNombre(apellido);

      if (validarCedula.status === "error") return validarCedula;
      if (validarNombre.status === "error") return validarNombre;
      if (validarApellido.status === "error") return validarApellido;
      if (validarCorreo.status === "error") return validarCorreo;

      const validarClave = this.validarCampoClave(claveUno, claveDos);
      if (validarClave.status === "error") return validarClave;

      return retornarRespuestaFunciones(
        msjCorrectos.ok,
        "Campos validados...",
        {
          cedula: validarCedula.cedula,
          nombre: validarNombre.nombre,
          apellido: validarApellido.nombre,
          correo: validarCorreo.correo,
        }
      );
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
          "Error, debe ser un número entero..."
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

  static validarCamposCrearDepartamento(nombre, descripcion) {
    try {
      const validarNombre = this.validarCampoNombre(nombre);

      if (validarNombre.status === "error") return validarNombre;

      /**
        if (!descripcion) {
          return retornarRespuestaFunciones(
            "error",
            "Error, campo descripción vacio..."
          );
        }
      */
      return retornarRespuestaFunciones("ok", "Campos validados...");
    } catch (error) {
      console.log(`Error, interno validando campos departamento: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error, interno validando campos departamento..."
      );
    }
  }
}
