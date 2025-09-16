import DivMensajeInput from "../mensaje/DivMensaje";
import Input from "./Input";
import { edadRegex } from "@/utils/constantes";

export default function InputEdad({
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
  validarEdad,
  setValidarEdad,
  setValue,
}) {
  const validandoCampos = (campo) => {
    if (indice === "edad") {
      return edadRegex.test(campo);
    }
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
    if (/^0/.test(valor)) return;

    // Solo permitir hasta dos dígitos numéricos
    if (!/^\d{1,2}$/.test(valor)) return;

    setValue(valor);

    if (indice === "edad") {
      const esValido = validandoCampos(valor);
      setValidarEdad(esValido);
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

      {indice === "edad" && value && !validarEdad && (
        <DivMensajeInput mensaje={"Debe ser entre 18 y 99..."} />
      )}
    </div>
  );
}
