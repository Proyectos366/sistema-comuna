import DivMensajeInput from "@/components/mensaje/DivMensaje";
import LabelInput from "@/components/inputs/LabelInput";
import Input from "@/components/inputs/Input";

import { cedulaRegex } from "@/utils/regex/cedulaRegex";
import { prefijoRegex } from "@/utils/regex/prefijoRegex";
import { puntosRegex } from "@/utils/regex/puntosRegex";
import { noNumerosRegex } from "@/utils/regex/noNumerosRegex";
import { insertarPuntosRegex } from "@/utils/regex/insertarPuntosRegex";
import { caracteresInvalidosRegex } from "@/utils/regex/caracteresInvalidosRegex";

export default function InputCedula({
  disabled,
  className,
  placeholder,
  value,
  onChange,
  autoComplete,
  readOnly,
  validarCedula,
  setValidarCedula,
  setValue,
  name,
  indice,
  htmlFor,
  nombre,
}) {
  // Elimina puntos y prefijo V-
  const limpiarCedula = (valor) =>
    valor.replace(prefijoRegex, "").replace(puntosRegex, "");

  // Añade puntos cada 3 dígitos y prepende V-
  const formatearCedula = (valor) => {
    const soloNumeros = valor.replace(noNumerosRegex, "");
    const conPuntos = soloNumeros.replace(insertarPuntosRegex, ".");
    return `V-${conPuntos}`;
  };

  const leyendoInput = (e) => {
    const valorEntrada = e.target.value;

    // Elimina prefijo y puntos para validar
    const cedulaSinFormato = limpiarCedula(valorEntrada);

    // Si no queda ningún número, borra todo el valor
    if (cedulaSinFormato.length === 0) {
      setValue?.("");
      setValidarCedula?.(false);
      onChange?.(e);
      return;
    }

    // Validación previa
    if (
      cedulaSinFormato.startsWith("0") ||
      caracteresInvalidosRegex.test(cedulaSinFormato) ||
      cedulaSinFormato.length > 8
    ) {
      return;
    }

    const cedulaFormateada = formatearCedula(cedulaSinFormato);
    setValue?.(cedulaFormateada);

    const esValida = cedulaRegex.test(cedulaSinFormato);
    setValidarCedula?.(esValida);

    onChange?.(e);
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "cedula"}
      nombre={nombre ? nombre : "Cédula"}
    >
      <Input
        type={"text"}
        id={htmlFor}
        value={value}
        name={name}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "V-0.000.000"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        indice={"cedula"}
      />

      {value && !validarCedula && <DivMensajeInput mensaje="Cédula inválida" />}
    </LabelInput>
  );
}
