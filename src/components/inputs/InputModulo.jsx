import DivMensajeInput from "@/components/mensaje/DivMensaje";
import Input from "@/components/inputs/Input";
import LabelInput from "@/components/inputs/LabelInput";

import { moduloRegex } from "@/utils/regex/moduloRegex";

export default function InputModulo({
  indice,
  disabled,
  className,
  placeholder,
  value,
  autoComplete,
  readOnly,
  ref,
  max,
  validarModulo,
  setValidarModulo,
  setValue,
  htmlFor,
  nombre,
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
    if (!moduloRegex.test(valor)) {
      return;
    }

    setValue(valor);

    if (indice === "modulo") {
      const esValido = validandoCampos(valor);
      setValidarModulo(esValido);
    }
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "modulo"}
      nombre={nombre ? nombre : "Modulo"}
    >
      <Input
        type={"text"}
        id={htmlFor ? htmlFor : "modulo"}
        value={value}
        name={htmlFor ? htmlFor : "modulo"}
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
    </LabelInput>
  );
}
