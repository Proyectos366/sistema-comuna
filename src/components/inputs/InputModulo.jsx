import DivMensajeInput from "../mensaje/DivMensaje";
import Input from "./Input";
import { moduloRegex } from "@/utils/constantes";

export default function InputModulo({
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
  validarModulo,
  setValidarModulo,
  setValue,
}) {
  const validandoCampos = (campo) => {
    if (indice === "modulo") {
      return moduloRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    // Permitir borrar
    if (valor === "") {
      setValue("");
      setValidarModulo(false);
      return;
    }

    // Si el valor no es un número entre 1 y 9, no actualizar
    if (!/^[1-9]?$/.test(valor)) {
      return;
    }

    setValue(valor);

    if (indice === "modulo") {
      const esValido = validandoCampos(valor);
      setValidarModulo(esValido);
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

      {indice === "modulo" && value && !validarModulo && (
        <DivMensajeInput mensaje={"Debe ser un número entero..."} />
      )}
    </div>
  );
}
