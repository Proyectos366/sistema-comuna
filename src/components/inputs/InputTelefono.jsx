import Input from "./Input";
import DivMensajeInput from "../mensaje/DivMensaje";
import {
  soloNumerosRegex,
  validarSoloNumerosRegex,
  phoneVenezuelaRegex,
  digitoDosPhoneVenezuelaRegex,
} from "@/utils/constantes";

export default function InputTelefono({
  type,
  indice,
  name,
  disabled,
  className,
  placeholder,
  id,
  onChange,
  value,
  autoComplete,
  readOnly,
  ref,
  max,
  validarTelefono,
  setValidarTelefono,
  setValue,
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

    if (indice === "telefono") {
      const esValido = validandoCampos(formateado);
      setValidarTelefono(esValido);
    }

    onChange?.(e);
  };

  return (
    <div className="space-y-2 relative">
      <Input
        type={type}
        id={id}
        value={value}
        name={name}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={ref}
        max={max}
        indice={indice}
      />

      {indice === "telefono" && value && !validarTelefono && (
        <DivMensajeInput mensaje="Debe tener 11 dígitos válidos (ej: 0414-123.45.67)" />
      )}
    </div>
  );
}
