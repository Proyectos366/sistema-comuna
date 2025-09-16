import DivMensajeInput from "../mensaje/DivMensaje";
import Input from "./Input";
import { textRegex } from "@/utils/constantes";

export default function InputNombre({
  type,
  indice,
  name,
  disabled,
  className,
  placeholder,
  id,
  onChange,
  value,
  setValue,
  autoComplete,
  readOnly,
  ref,
  max,
  validarNombre,
  setValidarNombre,
}) {
  const validandoCampos = (campo) => {
    if (indice === "nombre") {
      return textRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    setValue?.(valor);

    if (indice === "nombre") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarNombre(true);
      } else {
        setValidarNombre(false);
      }
    }
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

      {indice === "nombre" && value && !validarNombre && (
        <DivMensajeInput mensaje={"Solo letras"} />
      )}
    </div>
  );
}
