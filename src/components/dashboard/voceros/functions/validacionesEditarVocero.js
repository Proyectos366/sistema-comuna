import { textRegex } from "@/utils/regex/textRegex";
import { cedulaRegex } from "@/utils/regex/cedulaRegex";
import { insertarPuntosRegex } from "@/utils/regex/insertarPuntosRegex";
import { noNumerosRegex } from "@/utils/regex/noNumerosRegex";

// --- Validaciones individuales ---
export const validarNombreVoceroEditar = (valor, setValidarNombre) => {
  if (!valor) return;
  const limpio = String(valor).trim();
  const esValido = textRegex.test(limpio);
  setValidarNombre?.(esValido);
};

export const validarCedulaVoceroEditar = (valor, setCedula, setValidarCedula) => {
  if (!valor) {
    setCedula?.("");
    setValidarCedula?.(false);
    return;
  }

  const soloNumeros = String(valor).trim().replace(noNumerosRegex, "");
  const invalida =
    soloNumeros.length === 0 ||
    soloNumeros.startsWith("0") ||
    soloNumeros.length > 8;

  if (invalida) {
    setCedula?.("");
    setValidarCedula?.(false);
    return;
  }

  const conPuntos = soloNumeros.replace(insertarPuntosRegex, ".");
  const cedulaFormateada = `V-${conPuntos}`;

  setCedula?.(cedulaFormateada);
  setValidarCedula?.(cedulaRegex.test(soloNumeros));
};


