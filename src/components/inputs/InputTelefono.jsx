import DivMensajeInput from "@/components/mensaje/DivMensaje";
import LabelInput from "@/components/inputs/LabelInput";
import Input from "@/components/inputs/Input";

import { soloNumerosRegex } from "@/utils/regex/soloNumerosRegex";
import { validarSoloNumerosRegex } from "@/utils/regex/validarSoloNumerosRegex";
import {
  digitoDosPhoneVenezuelaRegex,
  phoneVenezuelaRegex,
} from "@/utils/regex/telefonoRegex";

export default function InputTelefono({
  indice,
  disabled,
  className,
  placeholder,
  onChange,
  value,
  autoComplete,
  readOnly,
  validarTelefono,
  setValidarTelefono,
  setValue,
  htmlFor,
  nombre,
}) {
  // Prefijos válidos: móviles y fijos
  const prefijosValidos = ["0412", "0414", "0416", "0424", "0426"];

  const formatoTelefono = (valor) => {
    const soloNumeros = valor.replace(soloNumerosRegex, "").slice(0, 11);

    if (soloNumeros.length <= 4) return soloNumeros;
    if (soloNumeros.length <= 7)
      return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
    if (soloNumeros.length <= 9)
      return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(
        4,
        7
      )}.${soloNumeros.slice(7)}`;
    return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(
      4,
      7
    )}.${soloNumeros.slice(7, 9)}.${soloNumeros.slice(9, 11)}`;
  };

  const validandoCampos = (campo) => {
    const soloNumeros = campo.replace(soloNumerosRegex, "");
    return phoneVenezuelaRegex.test(soloNumeros);
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;
    const soloNumeros = valor.replace(soloNumerosRegex, "");

    if (soloNumeros === "") {
      setValue("");
      setValidarTelefono(false);
      return;
    }

    if (!validarSoloNumerosRegex.test(soloNumeros)) return;
    if (soloNumeros.charAt(0) !== "0") return;
    if (
      soloNumeros.length >= 2 &&
      !digitoDosPhoneVenezuelaRegex.test(soloNumeros.charAt(1))
    )
      return;
    if (soloNumeros.length > 11) return;

    // Validar prefijo completo
    if (soloNumeros.length >= 4) {
      const prefijo = soloNumeros.slice(0, 4);
      if (!prefijosValidos.includes(prefijo)) return;
    }

    const formateado = formatoTelefono(soloNumeros);
    setValue(formateado);

    const esValido = validandoCampos(formateado);
    setValidarTelefono(esValido);

    onChange?.(e);
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "telefono"}
      nombre={nombre ? nombre : "Teléfono"}
    >
      <Input
        type={"text"}
        id={htmlFor ? htmlFor : "telfono"}
        value={value}
        name={htmlFor ? htmlFor : "telefono"}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "0000-000.00.00"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        indice={indice}
      />

      {value && !validarTelefono && (
        <DivMensajeInput mensaje="Debe tener 11 dígitos válidos (ej: 0414-123.45.67)" />
      )}
    </LabelInput>
  );
}
