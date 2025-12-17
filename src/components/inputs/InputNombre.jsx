import DivMensajeInput from "@/components/mensaje/DivMensaje";
import LabelInput from "@/components/inputs/LabelInput";
import Input from "@/components/inputs/Input";

import { textRegex } from "@/utils/regex/textRegex";

export default function InputNombre({
  indice,
  name,
  disabled,
  className,
  placeholder,
  value,
  setValue,
  autoComplete,
  readOnly,
  validarNombre,
  setValidarNombre,
  htmlFor,
  nombre,
}) {
  const validandoCampos = (campo) => {
    return textRegex.test(campo);
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    setValue?.(valor);

    const esValido = validandoCampos(valor);

    if (esValido) {
      setValidarNombre(true);
    } else {
      setValidarNombre(false);
    }
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "nombre"}
      nombre={nombre ? nombre : "Nombre"}
    >
      <Input
        type={"text"}
        id={htmlFor ? htmlFor : "nombre"}
        value={value}
        name={name}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "Daniela"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        indice={indice}
      />

      {value && !validarNombre && <DivMensajeInput mensaje={"Solo letras"} />}
    </LabelInput>
  );
}
