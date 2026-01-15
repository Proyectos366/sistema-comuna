import { textRegex } from "@/utils/regex/textRegex";
import { cedulaRegex } from "@/utils/regex/cedulaRegex";
import { insertarPuntosRegex } from "@/utils/regex/insertarPuntosRegex";
import { noNumerosRegex } from "@/utils/regex/noNumerosRegex";
import { edadRegex } from "@/utils/regex/edadRegex";
import { soloNumerosRegex } from "@/utils/regex/soloNumerosRegex";
import { validarSoloNumerosRegex } from "@/utils/regex/validarSoloNumerosRegex";
import {
  digitoDosPhoneVenezuelaRegex,
  phoneVenezuelaRegex,
} from "@/utils/regex/telefonoRegex";
import { emailRegex } from "@/utils/regex/correoRegex";

// --- Validaciones individuales ---
export const validarCedulaVoceroEditar = (valor, setValor, setValidarValor) => {
  if (!valor) {
    setValor?.("");
    setValidarValor?.(false);
    return;
  }

  const soloNumeros = String(valor).trim().replace(noNumerosRegex, "");
  const invalida =
    soloNumeros.length === 0 ||
    soloNumeros.startsWith("0") ||
    soloNumeros.length > 8;

  if (invalida) {
    setValor?.("");
    setValidarValor?.(false);
    return;
  }

  const conPuntos = soloNumeros.replace(insertarPuntosRegex, ".");
  const cedulaFormateada = `V-${conPuntos}`;

  setValor?.(cedulaFormateada);
  setValidarValor?.(cedulaRegex.test(soloNumeros));
};

export const validarEdadVoceroEditar = (valor, setValor, setValidarValor) => {
  if (!valor) {
    setValidarValor?.(false);
    return;
  }

  // Convertir a número para validación
  const limpio = Number(valor);

  // Validar con el regex de edad (18–99)
  const esValido = edadRegex.test(limpio);

  setValidarValor?.(esValido);
  setValor?.(limpio);
};

export const validarNombreVoceroEditar = (valor, setValor, setValidarValor) => {
  if (!valor) return;
  const limpio = String(valor).trim();
  const esValido = textRegex.test(limpio);
  setValidarValor?.(esValido);
  setValor?.(limpio);
};

export const validarTelefonoVoceroEditar = (
  valor,
  setValor,
  setValidarValor
) => {
  if (!valor) {
    setValor?.("");
    setValidarValor?.(false);
    return;
  }

  const prefijosValidos = ["0412", "0414", "0416", "0424", "0426"];

  // Limpiar y dejar solo números
  const soloNumeros = String(valor).trim().replace(soloNumerosRegex, "");

  const invalida =
    soloNumeros.length === 0 ||
    soloNumeros.charAt(0) !== "0" || // debe empezar con 0
    !validarSoloNumerosRegex.test(soloNumeros) ||
    soloNumeros.length > 11;

  if (invalida) {
    setValor?.("");
    setValidarValor?.(false);
    return;
  }

  // Validar segundo dígito
  if (
    soloNumeros.length >= 2 &&
    !digitoDosPhoneVenezuelaRegex.test(soloNumeros.charAt(1))
  ) {
    setValor?.("");
    setValidarValor?.(false);
    return;
  }

  // Validar prefijo completo
  if (soloNumeros.length >= 4) {
    const prefijo = soloNumeros.slice(0, 4);
    if (!prefijosValidos.includes(prefijo)) {
      setValor?.("");
      setValidarValor?.(false);
      return;
    }
  }

  // Formatear número
  let telefonoFormateado = soloNumeros;
  if (soloNumeros.length <= 4) {
    telefonoFormateado = soloNumeros;
  } else if (soloNumeros.length <= 7) {
    telefonoFormateado = `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
  } else if (soloNumeros.length <= 9) {
    telefonoFormateado = `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(
      4,
      7
    )}.${soloNumeros.slice(7)}`;
  } else {
    telefonoFormateado = `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(
      4,
      7
    )}.${soloNumeros.slice(7, 9)}.${soloNumeros.slice(9, 11)}`;
  }

  setValor?.(telefonoFormateado);
  setValidarValor?.(phoneVenezuelaRegex.test(soloNumeros));
};

export const validarCorreoVoceroEditar = (valor, setValor, setValidarValor) => {
  if (!valor) {
    setValor?.("");
    setValidarValor?.(false);
    return;
  }

  const limpio = String(valor).trim();

  // Si está vacío o no cumple el regex de correo
  if (limpio.length === 0 || !emailRegex.test(limpio)) {
    setValor?.(limpio);
    setValidarValor?.(false);
    return;
  }

  // Si pasa la validación, se guarda tal cual
  setValor?.(limpio);
  setValidarValor?.(true);
};
