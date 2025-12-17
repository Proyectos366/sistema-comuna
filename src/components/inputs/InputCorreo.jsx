import DivMensajeInput from "@/components/mensaje/DivMensaje";
import LabelInput from "@/components/inputs/LabelInput";
import Input from "@/components/inputs/Input";

import { emailRegex } from "@/utils/regex/correoRegex";

export default function InputCorreo({
  indice,
  name,
  disabled,
  className,
  placeholder,
  value,
  setValue,
  autoComplete,
  readOnly,
  validarCorreo,
  setValidarCorreo,
  htmlFor,
  nombre,
}) {
  const validandoCampos = (campo) => {
    return emailRegex.test(campo);
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    setValue?.(valor);

    const esValido = validandoCampos(valor);
    setValidarCorreo?.(esValido);
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "correo"}
      nombre={nombre ? nombre : "correo"}
    >
      <Input
        type={"email"}
        id={htmlFor ? htmlFor : "correo"}
        value={value}
        name={name}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "ejemplo@ejemplo.com"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        indice={indice}
      />
      {value && !validarCorreo && (
        <DivMensajeInput mensaje={"Formato de correo invalido"} />
      )}
    </LabelInput>
  );
}
