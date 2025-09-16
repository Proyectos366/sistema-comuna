/**
 @fileoverview Clase de validaciones para campos comunes en formularios. Este módulo centraliza
 la lógica de validación para entradas como correos, teléfonos, claves, etc. Utiliza expresiones
 regulares definidas en constantes y funciones utilitarias para sanitizar datos.
 @module services/ValidarCampos
*/

import retornarRespuestaFunciones from "@/utils/respuestasValidaciones"; // Utilidad para estructurar respuestas internas
import { quitarCaracteres } from "@/utils/quitarCaracteres"; // Función para limpiar caracteres no deseados
import {
  phoneRegex,
  emailRegex,
  claveRegex,
  cedulaRegex,
  textRegex,
  rifRegex,
  fechaFormatoIsoRegex,
} from "@/utils/constantes"; // Expresiones regulares para validaciones específicas

/**
 Clase que agrupa métodos estáticos para validar campos individuales. Cada método retorna una
 respuesta estructurada con estado, mensaje y datos procesados.
*/

export default class ValidarCampos {
  /**
   Valida el campo de correo electrónico. Verifica que no esté vacío y que cumpla con el formato
   estándar. Convierte el correo a minúsculas para normalizarlo.
   @function validarCampoCorreo
   @param {string} correo - Correo electrónico ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y correo normalizado si es válido.
  */
  static validarCampoCorreo(correo) {
    try {
      // 1. Verifica si el campo está vacío
      if (!correo) {
        return retornarRespuestaFunciones("error", "Campo correo vacio...");
      }

      // 2. Valida el formato del correo usando expresión regular
      if (!emailRegex.test(correo)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato de correo invalido..."
        );
      }

      // 3. Normaliza el correo a minúsculas
      const correoLetrasMinusculas = correo.toLowerCase();

      // 4. Retorna respuesta exitosa con el correo validado
      return retornarRespuestaFunciones("ok", "Campo correo correcto...", {
        correo: correoLetrasMinusculas,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error interno campo correo: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo correo");
    }
  }

  /**
   Valida el campo de nombre. Verifica que no esté vacío y que cumpla con el formato de texto
   permitido (letras y espacios). Convierte el nombre a minúsculas para normalizarlo.
   @function validarCampoNombre
   @param {string} nombre - Nombre ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y nombre normalizado si es válido.
  */
  static validarCampoNombre(nombre) {
    try {
      // 1. Verifica si el campo está vacío
      if (!nombre) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo nombre vacio..."
        );
      }

      // 2. Valida el formato del nombre usando expresión regular
      if (!textRegex.test(nombre)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato de nombre invalido..."
        );
      }

      // 3. Normaliza el nombre a minúsculas
      const nombreLetrasMinusculas = nombre.toLowerCase();

      // 4. Retorna respuesta exitosa con el nombre validado
      return retornarRespuestaFunciones("ok", "Campo nombre correcto", {
        nombre: nombreLetrasMinusculas,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error interno campo nombre: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo nombre");
    }
  }

  /**
   Valida un campo de texto genérico. Verifica que no esté vacío y lo normaliza a minúsculas.
   No aplica reglas de formato específicas.
   @function validarCampoTexto
   @param {string} texto - Texto ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y texto normalizado si es válido.
  */
  static validarCampoTexto(texto) {
    try {
      // 1. Verifica si el campo está vacío
      if (!texto) {
        return retornarRespuestaFunciones(
          "error",
          "Error campo texto vacio..."
        );
      }

      // 2. Normaliza el texto a minúsculas
      const textoLetrasMinusculas = texto.toLowerCase();

      // 3. Retorna respuesta exitosa con el texto validado
      return retornarRespuestaFunciones("ok", "Campo valido...", {
        texto: textoLetrasMinusculas,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error, interno campo texto: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error, interno campo texto..."
      );
    }
  }

  /**
   Valida el campo de código postal. Verifica que no esté vacío y lo normaliza a minúsculas. No
   aplica reglas de formato específicas, se asume validación externa si es necesario.
   @function validarCampoCodigoPostal
   @param {string} codigoPostal - Código postal ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y código postal normalizado si es válido.
  */
  static validarCampoCodigoPostal(codigoPostal) {
    try {
      // 1. Verifica si el campo está vacío
      if (!codigoPostal) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo codigo postal vacio..."
        );
      }

      // 2. Normaliza el código postal a minúsculas
      const textoLetrasMinusculas = codigoPostal.toLowerCase();

      // 3. Retorna respuesta exitosa con el código postal validado
      return retornarRespuestaFunciones("ok", "Campo valido...", {
        codigoPostal: textoLetrasMinusculas,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campo codigo postal: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campo codigo postal..."
      );
    }
  }

  /**
   Valida el segundo nombre o segundo apellido. Si el campo está presente, verifica que contenga
   solo letras usando una expresión regular. Normaliza el texto a minúsculas y lo retorna con la
   clave correspondiente.
   @function validarCampoNombreApellidoDos
   @param {string} nombre - Segundo nombre o segundo apellido.
   @param {string} opcion - Indica si se está validando "nombre" o "apellido".
   @returns {Object} Objeto con estado, mensaje y campo normalizado.
  */
  static validarCampoNombreApellidoDos(nombre, opcion) {
    try {
      // 1. Si el campo está presente, valida que solo contenga letras
      if (nombre && !textRegex.test(nombre)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, segundo ${
            opcion === "apellido" ? "apellido" : "nombre"
          } solo letras`
        );
      }

      // 2. Normaliza el texto y lo asigna al campo correspondiente
      const campo =
        opcion === "apellido"
          ? { apellido_dos: nombre ? nombre.toLowerCase() : "" }
          : { nombre_dos: nombre ? nombre.toLowerCase() : "" };

      // 3. Retorna respuesta exitosa con el campo validado
      return retornarRespuestaFunciones(
        "ok",
        `Campo segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        } valido...`,
        campo
      );
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(
        `Error interno validando segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        }: ` + error
      );

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        `Error interno validando segundo ${
          opcion === "apellido" ? "apellido" : "nombre"
        }...`
      );
    }
  }

  /**
   Valida el campo de cédula venezolana. Limpia caracteres no numéricos, verifica que sea un número
   válido y que cumpla con el formato.
   @function validarCampoCedula
   @param {string|number} cedula - Cédula ingresada por el usuario.
   @returns {Object} Objeto con estado, mensaje y cédula validada.
  */
  static validarCampoCedula(cedula) {
    try {
      // 1. Verifica si el campo está vacío
      if (!cedula) {
        return retornarRespuestaFunciones("error", "Campo cedula vacio...");
      }

      // 2. Elimina caracteres no numéricos
      const cedulaLimpia = quitarCaracteres(cedula);

      // 3. Convierte a número
      const cedulaNumero = Number(cedulaLimpia);

      // 4. Verifica si es un número válido
      if (isNaN(cedulaNumero)) {
        return retornarRespuestaFunciones("error", "Error, cedula inválida...");
      }

      // 5. Verifica longitud válida (7 u 8 dígitos)
      if (cedulaNumero.length < 7 || cedulaNumero.length > 8) {
        return retornarRespuestaFunciones(
          "error",
          "Error, cedula incorrecta...."
        );
      }

      // 6. Verifica formato con expresión regular
      if (!cedulaRegex.test(cedulaNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Formato de cédula invalido..."
        );
      }

      // 7. Retorna respuesta exitosa con la cédula validada
      return retornarRespuestaFunciones("ok", "Campo cedula correcto...", {
        cedula: cedulaNumero,
      });
    } catch (error) {
      // 8. Manejo de errores inesperados
      console.log(`Error interno, campo cedula: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno, campo cedula");
    }
  }

  /**
   Valida el campo de número telefónico venezolano. Limpia caracteres no numéricos y verifica que
   cumpla con el formato de 11 dígitos.
   @function validarCampoTelefono
   @param {string|number} telefono - Número telefónico ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y teléfono validado.
  */
  static validarCampoTelefono(telefono) {
    try {
      // 1. Verifica si el campo está vacío
      if (!telefono) {
        return retornarRespuestaFunciones("error", "Campo teléfono vacio...");
      }

      // 2. Elimina caracteres no numéricos
      const telefonoLimpio = quitarCaracteres(telefono);

      // 3. Verifica formato con expresión regular
      if (!phoneRegex.test(telefonoLimpio)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato teléfono invalido..."
        );
      }

      // 4. Retorna respuesta exitosa con el teléfono validado
      return retornarRespuestaFunciones("ok", "Campo teléfono valido...", {
        telefono: telefonoLimpio,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error interno, campo teléfono: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno, campo teléfono"
      );
    }
  }

  /**
   Valida el campo de edad. Verifica que no esté vacío, que sea un número válido, y que esté dentro
   del rango permitido (18–99).
   @function validarCampoEdad
   @param {string|number} edad - Edad ingresada por el usuario.
   @returns {Object} Objeto con estado, mensaje y edad validada.
  */
  static validarCampoEdad(edad) {
    try {
      // 1. Verifica si el campo está vacío
      if (!edad) {
        return retornarRespuestaFunciones("error", "Campo edad vacio...");
      }

      // 2. Convierte el valor a número
      const edadNumero = Number(edad);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(edadNumero) || edadNumero <= 0) {
        return retornarRespuestaFunciones("error", "Error, edad inválida...");
      }

      // 4. Verifica si la edad es excesivamente alta
      if (edadNumero > 99) {
        return retornarRespuestaFunciones("error", "Error, edad muy alta....");
      }

      // 5. Verifica si es menor de edad
      if (edadNumero < 18) {
        return retornarRespuestaFunciones(
          "error",
          "Error, es un menor de edad...."
        );
      }

      // 6. Retorna respuesta exitosa con la edad validada
      return retornarRespuestaFunciones("ok", "Campo edad valido...", {
        edad: edadNumero,
      });
    } catch (error) {
      // 7. Manejo de errores inesperados
      console.log(`Error interno, campo edad: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno, campo edad");
    }
  }

  /**
   Valida un campo de ID numérico. Verifica que no esté vacío, que sea un número válido y mayor a cero.
   El mensaje se personaliza según el tipo de ID indicado en `detalles`.
   @function validarCampoId
   @param {string|number} id - ID ingresado por el usuario.
   @param {string} detalles - Descripción del campo (ej. "usuario", "institución").
   @returns {Object} Objeto con estado, mensaje y ID validado.
  */
  static validarCampoId(id, detalles) {
    try {
      // 1. Verifica si el campo está vacío
      if (!id) {
        return retornarRespuestaFunciones(
          "error",
          `Campo id ${detalles} vacio...`
        );
      }

      // 2. Convierte el valor a número
      const idNumero = Number(id);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(idNumero) || idNumero <= 0) {
        return retornarRespuestaFunciones(
          "error",
          `Error, id ${detalles} inválido...`
        );
      }

      // 4. Retorna respuesta exitosa con el ID validado
      return retornarRespuestaFunciones(
        "ok",
        `Campo id ${detalles} valido...`,
        {
          id: idNumero,
        }
      );
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error, interno al (validar id ${detalles}): ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        `Error, interno al (validar id ${detalles})`
      );
    }
  }

  /**
   Valida los campos de contraseña y confirmación. Verifica que ambos estén presentes, que coincidan,
   y que cumplan con el formato seguro.
   @function validarCampoClave
   @param {string} claveUno - Contraseña principal ingresada por el usuario.
   @param {string} claveDos - Confirmación de la contraseña.
   @returns {Object} Objeto con estado, mensaje y claves validadas.
  */
  static validarCampoClave(claveUno, claveDos) {
    try {
      // 1. Verifica si la contraseña principal está vacía
      if (!claveUno) {
        return retornarRespuestaFunciones(
          "error",
          "Error campo clave vacio..."
        );
      }

      // 2. Verifica si el campo de confirmación está vacío
      if (!claveDos) {
        return retornarRespuestaFunciones(
          "error",
          "Error campo confirmar clave vacio..."
        );
      }

      // 3. Verifica si ambas contraseñas coinciden
      if (claveUno !== claveDos) {
        return retornarRespuestaFunciones(
          "error",
          "Error, claves no coinciden..."
        );
      }

      // 4. Verifica si la contraseña cumple con el formato seguro
      if (!claveRegex.test(claveUno)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, formato de clave invalido..."
        );
      }

      // 5. Retorna respuesta exitosa con las claves validadas
      return retornarRespuestaFunciones("ok", "Campos de clave validados...", {
        claveUno: claveUno,
        claveDos: claveDos,
      });
    } catch (error) {
      // 6. Manejo de errores inesperados
      console.log(`Error interno, campos claves: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno, campos claves"
      );
    }
  }

  /**
   Valida el campo de género. Acepta valores 1 o 2 (numéricos o string) que representan masculino o
   femenino. Convierte el valor a booleano: 1 → true (masculino), 2 → false (femenino).
   @function validarCampoGenero
   @param {string|number} genero - Valor del género ingresado (1 o 2).
   @returns {Object} Objeto con estado, mensaje y género convertido a booleano.
  */
  static validarCampoGenero(genero) {
    try {
      // 1. Verifica si el campo está vacío
      if (!genero) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo genero vacio..."
        );
      }

      // 2. Convierte el valor a número
      const generoNumero = Number(genero);

      // 3. Verifica si es un número válido
      if (isNaN(generoNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo genero invalido..."
        );
      }

      // 4. Verifica si es un número entero
      if (!Number.isInteger(generoNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo genero invalido..."
        );
      }

      // 5. Verifica si el valor es 1 o 2
      if (!(genero === 1 || genero === 2 || genero === "1" || genero === "2")) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo debe ser hombre o mujer..."
        );
      }

      // 6. Retorna respuesta exitosa con el género convertido a booleano
      return retornarRespuestaFunciones("ok", "Campo genero validado...", {
        genero: generoNumero === 1 ? true : false,
      });
    } catch (error) {
      // 7. Manejo de errores inesperados
      console.log(`Error interno campo genero: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campo genero..."
      );
    }
  }

  /**
   Valida un campo numérico que debe convertirse a booleano. Acepta valores 1 o 2 (numéricos o string)
   y los convierte: 1 → true, 2 → false. El mensaje se personaliza según el nombre del campo (`opcion`).
   @function validarCampoNumeroPasarBoolean
   @param {string|number} numero - Valor numérico ingresado.
   @param {string} opcion - Nombre del campo para personalizar el mensaje.
   @returns {Object} Objeto con estado, mensaje y valor booleano.
  */
  static validarCampoNumeroPasarBoolean(numero, opcion) {
    try {
      // 1. Verifica si el campo está vacío
      if (!numero) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} vacio...`
        );
      }

      // 2. Convierte el valor a número
      const numeroPasarBoolean = Number(numero);

      // 3. Verifica si es un número válido
      if (isNaN(numeroPasarBoolean)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} invalido...`
        );
      }

      // 4. Verifica si es un número entero
      if (!Number.isInteger(numeroPasarBoolean)) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} debe ser entero...`
        );
      }

      // 5. Verifica si el valor es 1 o 2
      if (!(numero === 1 || numero === 2 || numero === "1" || numero === "2")) {
        return retornarRespuestaFunciones(
          "error",
          `Error, campo ${opcion} deber ser 1 o 2...`
        );
      }

      // 6. Retorna respuesta exitosa con el valor convertido a booleano
      return retornarRespuestaFunciones("ok", `Campo ${opcion} valido...`, {
        boolean: numeroPasarBoolean === 1 ? true : false,
      });
    } catch (error) {
      // 7. Manejo de errores inesperados
      console.log(`Error, interno validando ${opcion}: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        `Error, interno validando ${opcion}`
      );
    }
  }

  /**
   Valida una fecha en formato ISO. Verifica que la fecha esté presente, tenga formato válido, sea
   interpretable, no esté en el futuro y no sea anterior al año 1900.
   @function validarCampoFechaISO
   @param {string} fecha - Fecha en formato ISO (ej. "2023-08-15T00:00:00Z").
   @returns {Object} Objeto con estado, mensaje y fecha convertida a objeto Date.
  */
  static validarCampoFechaISO(fecha) {
    try {
      // 1. Verifica si el campo está vacío
      if (!fecha) {
        return retornarRespuestaFunciones("error", "Campo fecha vacio...");
      }

      // 2. Verifica si el formato cumple con la expresión regular ISO
      if (!fechaFormatoIsoRegex.test(fecha)) {
        return retornarRespuestaFunciones(
          "error",
          "Error formato de fecha invalido..."
        );
      }

      // 3. Intenta convertir la fecha a objeto Date
      const fechaConvertida = new Date(fecha);

      // 4. Si la verificación es incorrecta retorna un error
      if (isNaN(fechaConvertida.getTime())) {
        return retornarRespuestaFunciones(
          "error",
          "Error no se puede interpretar la fecha..."
        );
      }

      // 5. Define límites de fecha
      const ahora = new Date();
      const fechaMinima = new Date("1900-01-01T00:00:00Z"); // ajustable si se necesita otro límite

      // 6. Verifica que la fecha no sea futura
      if (fechaConvertida > ahora) {
        return retornarRespuestaFunciones(
          "error",
          "Error fecha no puede pasar el dia actual..."
        );
      }

      // 7. Verifica que la fecha no sea demasiado antigua
      if (fechaConvertida < fechaMinima) {
        return retornarRespuestaFunciones(
          "error",
          "Error fecha muy antigua..."
        );
      }

      // 8. Retorna respuesta exitosa con la fecha convertida
      return retornarRespuestaFunciones("ok", "Campo fecha correcto...", {
        fecha: fechaConvertida,
      });
    } catch (error) {
      // 9. Manejo de errores inesperados
      console.log(`Error interno, campo fecha: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error, interno campo fecha..."
      );
    }
  }

  /**
   Valida el campo de cantidad de módulos. Verifica que el valor esté presente, sea un número
   entero positivo, y que esté dentro del rango permitido (1 a MAX_MODULOS).
   @function validarCampoModulo
   @param {string|number} modulo - Cantidad de módulos ingresada por el usuario.
   @returns {Object} Objeto con estado, mensaje y número de módulos validado.
  */
  static validarCampoModulo(modulo) {
    try {
      // 1. Verifica si el campo está vacío
      if (!modulo) {
        return retornarRespuestaFunciones("error", "Campo modulo vacio...");
      }

      // 2. Convierte el valor a número
      const moduloNumero = Number(modulo);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(moduloNumero) || moduloNumero <= 0) {
        return retornarRespuestaFunciones("error", "Error, modulo inválido...");
      }

      // 4. Verifica si es un número entero
      if (!Number.isInteger(moduloNumero)) {
        return retornarRespuestaFunciones(
          "error",
          "Error, modulo debe ser un número entero..."
        );
      }

      // 5. Verifica si el número mínimo es 1
      if (moduloNumero < 1) {
        return retornarRespuestaFunciones("error", "Error, minimo 1 modulo...");
      }

      const MAX_MODULOS = 9;

      // 6. Verifica si excede el máximo permitido
      if (moduloNumero > MAX_MODULOS) {
        return retornarRespuestaFunciones(
          "error",
          `Error, maximo ${MAX_MODULOS} módulos`
        );
      }

      // 7. Retorna respuesta exitosa con el número de módulos validado
      return retornarRespuestaFunciones("ok", "Campo modulo valido...", {
        modulo: moduloNumero,
      });
    } catch (error) {
      // 8. Manejo de errores inesperados
      console.log(`Error interno campo modulo: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo modulo");
    }
  }

  /**
   Valida el campo RIF (Registro de Información Fiscal). Verifica el formato general y el dígito
   verificador según el algoritmo del SENIAT.
   @function validarCampoRif
   @param {string} rif - RIF ingresado por el usuario.
   @returns {Object} Objeto con estado, mensaje y RIF validado.
  */
  static validarCampoRif(rif) {
    try {
      // 1. Verifica si el campo está vacío
      if (!rif) {
        return retornarRespuestaFunciones("error", "Campo RIF vacío...");
      }

      // 2. Limpia espacios y convierte a mayúsculas
      const rifLimpio = rif.trim().toUpperCase();

      // 3. Verifica el formato general con expresión regular
      if (!rifRegex.test(rifLimpio)) {
        return retornarRespuestaFunciones(
          "error",
          "Error formato de RIF inválido..."
        );
      }

      // 4. Extrae componentes del RIF
      // Validación del dígito verificador según SENIAT
      const letra = rifLimpio.charAt(0);
      const cuerpo = rifLimpio.slice(2, 10); // 8 dígitos
      const digitoOriginal = parseInt(rifLimpio.slice(-1), 10);

      // 5. Tabla de valores para letras según SENIAT
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

      // 6. Verifica si la letra es válida
      if (!valoresLetra[letra]) {
        return retornarRespuestaFunciones(
          "error",
          "Error letra de RIF inválida..."
        );
      }

      // 7. Calcula el dígito verificador
      const rifNumerico = [
        valoresLetra[letra],
        ...cuerpo.split("").map(Number),
      ];
      const suma = rifNumerico.reduce((acc, num, i) => acc + num * pesos[i], 0);
      const resto = suma % 11;
      const digitoCalculado = resto < 2 ? resto : 11 - resto;

      // 8. Compara con el dígito original
      if (digitoCalculado !== digitoOriginal) {
        return retornarRespuestaFunciones(
          "error",
          "Error dígito verificador incorrecto según SENIAT..."
        );
      }

      // 9. Retorna respuesta exitosa con el RIF validado
      return retornarRespuestaFunciones("ok", "RIF válido.", {
        rif: rifLimpio,
      });
    } catch (error) {
      // 10. Manejo de errores inesperados
      console.log(`Error interno campo RIF: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campo RIF");
    }
  }

  /**
   Valida un campo numérico que representa un rango. Verifica que el valor esté presente, sea un
   número válido y positivo. El mensaje se personaliza según el nombre del campo (`detalles`).
   @function validarCampoRango
   @param {string|number} rango - Valor numérico del rango.
   @param {string} detalles - Nombre del campo para personalizar el mensaje.
   @returns {Object} Objeto con estado, mensaje y rango validado.
  */
  static validarCampoRango(rango, detalles) {
    try {
      // 1. Verifica si el campo está vacío
      if (!rango) {
        return retornarRespuestaFunciones(
          "error",
          `Campo ${detalles} vacio...`
        );
      }

      // 2. Convierte el valor a número
      const numero = Number(rango);

      // 3. Verifica si es un número válido y positivo
      if (isNaN(numero) || numero <= 0) {
        return retornarRespuestaFunciones(
          "error",
          `Error ${detalles} inválido...`
        );
      }

      // 4. Retorna respuesta exitosa con el rango validado
      return retornarRespuestaFunciones("ok", `Campo ${detalles} valido...`, {
        rango: numero,
      });
    } catch (error) {
      // 5. Manejo de errores inesperados
      console.log(`Error interno campo rango: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", `Error interno campo rango`);
    }
  }

  /**
   Valida todos los campos necesarios para registrar un nuevo usuario. Aplica validaciones
   individuales para cada campo y retorna una respuesta consolidada.
   @function validarCamposRegistro
   @param {string|number} cedula - Cédula del usuario.
   @param {string} nombre - Nombre del usuario.
   @param {string} apellido - Apellido del usuario.
   @param {string} correo - Correo electrónico del usuario.
   @param {string} claveUno - Contraseña principal.
   @param {string} claveDos - Confirmación de la contraseña.
   @param {string|number} id_rol - ID del rol asignado al usuario.
   @param {string|number} autorizar - Valor que indica si el usuario está autorizado.
   @returns {Object} Objeto con estado, mensaje y datos validados o error.
  */
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
      // 1. Validaciones individuales
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

      // 2. Retorna el primer error encontrado
      if (validarCedula.status === "error") return validarCedula;
      if (validarNombre.status === "error") return validarNombre;
      if (validarApellido.status === "error") return validarApellido;
      if (validarCorreo.status === "error") return validarCorreo;
      if (validarClave.status === "error") return validarClave;
      if (validarIdRol.status === "error") return validarIdRol;
      if (validarAutorizar.status === "error") return validarAutorizar;

      // 3. Retorna respuesta exitosa con todos los datos validados
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
      // 4. Manejo de errores inesperados
      console.log(`Error interno, campos registro usuario: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error, interno campos resgistro usuario"
      );
    }
  }

  /**
   Valida los campos necesarios para crear un país. Verifica nombre, capital, descripción y serial.
   @function validarCamposCrearPais
  */
  static validarCamposCrearPais(nombre, capital, descripcion, serial) {
    try {
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoNombre(nombre);
      const validarCapital = this.validarCampoNombre(capital);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarSerial = this.validarCampoTexto(serial);

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarCapital.status === "error") return validarCapital;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarSerial.status === "error") return validarSerial;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        capital: validarCapital.nombre,
        descripcion: validarDescripcion.texto,
        serial: validarSerial.texto,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos pais: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campos pais");
    }
  }

  /**
   Valida los campos necesarios para crear un estado. Verifica nombre, capital, código postal,
   descripción e ID del país. @function validarCamposCrearEstado
  */
  static validarCamposCrearEstado(
    nombre,
    capital,
    codigoPostal,
    descripcion,
    id_pais
  ) {
    try {
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoNombre(nombre);
      const validarCapital = this.validarCampoNombre(capital);
      const validarCodigoPostal = this.validarCampoCodigoPostal(codigoPostal);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarCapital.status === "error") return validarCapital;
      if (validarCodigoPostal.status === "error") return validarCodigoPostal;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        capital: validarCapital.nombre,
        codigoPostal: validarCodigoPostal.codigoPostal,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos estado: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones("error", "Error interno campos estado");
    }
  }

  /**
   Valida los campos necesarios para crear un municipio. Verifica nombre, descripción, ID del país e
   ID del estado. @function validarCamposCrearMunicipio
  */
  static validarCamposCrearMunicipio(nombre, descripcion, id_pais, id_estado) {
    try {
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);
      const validarIdEstado = this.validarCampoId(id_estado);

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos municipio: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos municipio..."
      );
    }
  }

  /**
   Valida los campos necesarios para crear una parroquia. Verifica nombre, descripción y las
   relaciones con país, estado y municipio. @function validarCamposCrearParroquia
  */
  static validarCamposCrearParroquia(
    nombre,
    descripcion,
    id_pais,
    id_estado,
    id_municipio
  ) {
    try {
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarIdPais = this.validarCampoId(id_pais);
      const validarIdEstado = this.validarCampoId(id_estado);
      const validarIdMunicipio = this.validarCampoId(id_municipio);

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;
      if (validarIdMunicipio.status === "error") return validarIdMunicipio;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
        id_pais: validarIdPais.id,
        id_estado: validarIdEstado.id,
        id_municipio: validarIdMunicipio.id,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos parroquia: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos parroquia..."
      );
    }
  }

  /**
   Valida los campos necesarios para crear una institución. Verifica nombre, descripción, RIF, sector,
   dirección y ubicación geográfica. @function validarCamposCrearInstitucion
  */
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
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);
      const validarRif = this.validarCampoRif(rif);
      const validarSector = this.validarCampoTexto(sector);
      const validarDireccion = this.validarCampoTexto(direccion);
      const validarIdPais = this.validarCampoId(id_pais, "pais");
      const validarIdEstado = this.validarCampoId(id_estado, "estado");
      const validarIdMunicipio = this.validarCampoId(id_municipio, "municipio");
      const validarIdParroquia = this.validarCampoId(id_parroquia, "parroquia");

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;
      if (validarRif.status === "error") return validarRif;
      if (validarSector.status === "error") return validarSector;
      if (validarDireccion.status === "error") return validarDireccion;
      if (validarIdPais.status === "error") return validarIdPais;
      if (validarIdEstado.status === "error") return validarIdEstado;
      if (validarIdMunicipio.status === "error") return validarIdMunicipio;
      if (validarIdParroquia.status === "error") return validarIdParroquia;

      // 3. Consolidar datos validados y retornar respuesta exitosa
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
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos institución: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos institución..."
      );
    }
  }

  /**
   Valida los campos necesarios para crear un departamento. Verifica nombre y descripción.
   @function validarCamposCrearDepartamento
  */
  static validarCamposCrearDepartamento(nombre, descripcion) {
    try {
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoNombre(nombre);
      const validarDescripcion = this.validarCampoTexto(descripcion);

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarDescripcion.status === "error") return validarDescripcion;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.nombre,
        descripcion: validarDescripcion.texto,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos departamento: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos departamento..."
      );
    }
  }

  /**
   Valida los campos necesarios para el inicio de sesión. Verifica correo y que la clave esté presente.
   @function validarCamposLogin
  */
  static validarCamposLogin(correo, clave) {
    try {
      // 1. Validar cada campo individualmente
      const validarCorreo = this.validarCampoCorreo(correo);

      // 2. Verificar si las validaciones fallan
      if (validarCorreo.status === "error") return validarCorreo;
      if (!clave) {
        return retornarRespuestaFunciones(
          "error",
          "Error, campo clave vacio..."
        );
      }

      // 3. Retornar respuesta exitosa con los datos validados
      return retornarRespuestaFunciones("ok", "Campos validados", {
        correo: validarCorreo.correo,
        clave: clave,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos del login: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos del login"
      );
    }
  }

  /**
   Valida los campos necesarios para crear una comuna. @function validarCamposCrearComuna
  */
  static validarCamposCrearComuna(nombre, parroquiaId) {
    try {
      // 1. Validar cada campo individualmente
      const validarNombre = this.validarCampoTexto(nombre);
      const validarParroquiaId = this.validarCampoId(parroquiaId);

      // 2. Verificar si alguna validación falló
      if (validarNombre.status === "error") return validarNombre;
      if (validarParroquiaId.status === "error") return validarParroquiaId;

      // 3. Consolidar datos validados y retornar respuesta exitosa
      return retornarRespuestaFunciones("ok", "Campos validados...", {
        nombre: validarNombre.texto,
        id_parroquia: validarParroquiaId.id,
      });
    } catch (error) {
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos comuna: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos comuna..."
      );
    }
  }

  /**
   Valida los campos necesarios para crear un consejo comunal. @function validarCamposCrearConsejoComunal
  */
  static validarCamposCrearConsejoComunal(
    nombre,
    usuarioId,
    parroquiaId,
    comunaId,
    circuitoId,
    comunaCircuito
  ) {
    try {
      // 1. Validar cada campo
      const validaciones = {
        nombre: this.validarCampoTexto(nombre),
        id_usuario: this.validarCampoId(usuarioId),
        id_parroquia: this.validarCampoId(parroquiaId),
      };

      // 2. Verificar si alguna validación falló
      if (validaciones.nombre.status === "error") return validaciones.nombre;
      if (validaciones.id_usuario.status === "error")
        return validaciones.id_usuario;
      if (validaciones.id_parroquia.status === "error")
        return validaciones.id_parroquia;

      // 3. Variables para la condicion si pertenece a comuna o circuito comunal
      let id_comuna = null;
      let id_circuito = null;

      // 4. Validar campo condicional (comuna o circuito)
      if (comunaCircuito === "comuna") {
        const result = this.validarCampoId(comunaId);
        if (result.status === "error") return result;
        id_comuna = result.id;
      } else if (comunaCircuito === "circuito") {
        const result = this.validarCampoId(circuitoId);
        if (result.status === "error") return result;
        id_circuito = result.id;
      }

      // 5. Consolidar datos validados y retornar respuesta exitosa
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
      // 6. Manejo de errores inesperados
      console.error("Error interno campos consejo comunal:", error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos consejo comunal..."
      );
    }
  }

  /**
   Valida los campos necesarios para registrar un vocero. @function validarCamposRegistroVocero
  */
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
      // 1. Validar cada campo individualmente
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

      // 2. Verificar si alguna validación falló
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

      // 3. Consolidar datos validados y retornar respuesta exitosa
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
      // 4. Manejo de errores inesperados
      console.log(`Error interno campos vocero: ` + error);

      // Retorna una respuesta del error inesperado
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos vocero..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos formación: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos formación..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos cargo: ` + error);
      return retornarRespuestaFunciones("error", "Error interno campos cargo");
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos novedad: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos novedad"
      );
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar pais: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar pais..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar estado: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar estado..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar municipio: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar municipio..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar parroquia: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar parroquia..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar institución: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar institución..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar vocero: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar vocero..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar comuna: ` + error);

      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar comuna..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar consejo comunal: ` + error);

      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar consejo comunal..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar departamento: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar departamento..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar cargo: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar cargo..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar formación: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar formación..."
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
      // Retorna una respuesta del error inesperado
      console.log(`Error interno campos editar novedad: ` + error);
      return retornarRespuestaFunciones(
        "error",
        "Error interno campos editar novedad..."
      );
    }
  }
}
