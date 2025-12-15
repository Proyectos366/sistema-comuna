import DivMensajeInput from "@/components/mensaje/DivMensaje";
import Input from "@/components/inputs/Input";
import LabelInput from "@/components/inputs/LabelInput";

import { edadRegex } from "@/utils/regex/edadRegex";
import { sinCeroInicioRegex } from "@/utils/regex/sinCeroInicioRegex";
import { soloDosDigitosRegex } from "@/utils/regex/soloDosDigitosRegex";

export default function InputEdad({
  disabled,
  className,
  placeholder,
  value,
  autoComplete,
  readOnly,
  validarEdad,
  setValidarEdad,
  setValue,
  name,
  htmlFor,
  nombre,
}) {
  const validandoCampos = (campo) => {
    return edadRegex.test(campo);
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    // Permitir borrar
    if (valor === "") {
      setValue("");
      setValidarEdad(false);
      return;
    }

    // No permitir que comience con cero
    if (sinCeroInicioRegex.test(valor)) return;

    // Solo permitir hasta dos dígitos numéricos
    if (!soloDosDigitosRegex.test(valor)) return;

    setValue(valor);

    const esValido = validandoCampos(valor);
    setValidarEdad(esValido);
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "edad"}
      nombre={nombre ? nombre : "Edad"}
    >
      <Input
        type="text"
        id={htmlFor ? htmlFor : "edad"}
        value={value}
        name={name ? name : "edad"}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "Entre 18 y 99 años"}
        autoComplete={autoComplete}
        readOnly={readOnly}
      />

      {value && !validarEdad && (
        <DivMensajeInput mensaje={"Debe ser entre 18 y 99 años..."} />
      )}
    </LabelInput>
  );
}
