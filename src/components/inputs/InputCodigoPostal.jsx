import DivMensajeInput from "../mensaje/DivMensaje";
import Input from "./Input";
import {
  codigoPostalRegex,
  codigoPostalVacioRegex,
} from "@/utils/regex/codigoPostalRegex";

export default function InputCodigoPostal({
  indice,
  name,
  disabled,
  className,
  placeholder,
  id,
  value,
  autoComplete,
  readOnly,
  ref,
  max,
  validarCodigoPostal,
  setValidarCodigoPostal,
  setValue,
}) {
  const validandoCampos = (campo) => {
    if (indice === "codigoPostal") {
      return codigoPostalRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    // Permitir borrar
    if (valor === "") {
      setValue("");
      setValidarCodigoPostal(false);
      return;
    }

    // Solo permitir letras, números, espacios y guiones
    if (!codigoPostalVacioRegex.test(valor)) return;

    setValue(valor);

    if (indice === "codigoPostal") {
      const esValido = validandoCampos(valor);
      setValidarCodigoPostal(esValido);
    }
  };

  return (
    <div className="space-y-2 relative">
      <Input
        type={"text"}
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

      {indice === "codigoPostal" && value && !validarCodigoPostal && (
        <DivMensajeInput
          mensaje={"Código postal inválido. Ej: 1010, SW1A 1AA, H3Z 2Y7"}
        />
      )}
    </div>
  );
}
