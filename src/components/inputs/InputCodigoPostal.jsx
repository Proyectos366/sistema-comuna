import LabelInput from "@/components/inputs/LabelInput";
import Input from "@/components/inputs/Input";
import DivMensajeInput from "@/components/mensaje/DivMensaje";

import {
  codigoPostalRegex,
  codigoPostalVacioRegex,
} from "@/utils/regex/codigoPostalRegex";

export default function InputCodigoPostal({
  indice,
  disabled,
  className,
  placeholder,
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
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "codigoPostal"}
      nombre={nombre ? nombre : "Código postal"}
    >
      <Input
        type={"text"}
        id={htmlFor ? htmlFor : "codigoPostal"}
        value={value}
        name={htmlFor ? htmlFor : "codigoPostal"}
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

      {value && !validarCodigoPostal && (
        <DivMensajeInput
          mensaje={"Código postal inválido. Ej: 1010, SW1A 1AA, H3Z 2Y7"}
        />
      )}
    </LabelInput>
  );
}
