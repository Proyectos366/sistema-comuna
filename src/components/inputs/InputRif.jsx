import LabelInput from "@/components/inputs/LabelInput";
import Input from "@/components/inputs/Input";
import DivMensajeInput from "@/components/mensaje/DivMensaje";

import { noNumerosRegex } from "@/utils/regex/noNumerosRegex";
import { rifRegex } from "@/utils/regex/rifRegex";

export default function InputRif({
  indice,
  disabled,
  className,
  placeholder,
  value,
  onChange,
  autoComplete,
  readOnly,
  ref,
  max,
  validarRif,
  setValidarRif,
  setValue,
}) {
  // Elimina guiones y letras para validar
  const limpiarRif = (valor) => {
    const letra = valor.charAt(0).toUpperCase();
    const numeros = valor.replace(noNumerosRegex, "").slice(0, 9);
    return `${letra}${numeros}`;
  };

  // Formatea el RIF con guiones y letra inicial
  const formatearRif = (valor) => {
    const letra = valor.charAt(0).toUpperCase(); // Conserva la letra inicial
    const soloNumeros = valor.replace(noNumerosRegex, "");
    const cuerpo = soloNumeros.slice(0, 8);
    const verificador = soloNumeros.slice(8, 9);
    return `${letra}-${cuerpo}-${verificador}`;
  };

  const leyendoInput = (e) => {
    const valorEntrada = e.target.value;

    // Limpia para validar
    const rifSinFormato = limpiarRif(valorEntrada);

    if (rifSinFormato.length < 9) {
      setValue?.(valorEntrada);
      setValidarRif?.(false);
      onChange?.(e);
      return;
    }

    const rifFormateado = formatearRif(rifSinFormato);
    setValue?.(rifFormateado);

    const esValido = rifRegex.test(rifFormateado);
    setValidarRif?.(esValido);

    onChange?.(e);
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "rif"}
      nombre={nombre ? nombre : "Rif"}
    >
      <Input
        type={"text"}
        id={htmlFor ? htmlFor : "rif"}
        value={value}
        name={htmlFor ? htmlFor : "rif"}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "X-01234567-0"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={ref}
        max={max}
        indice={indice}
      />

      {value && !validarRif && (
        <DivMensajeInput mensaje="Formato de RIF inválido" />
      )}
    </LabelInput>
  );
}
