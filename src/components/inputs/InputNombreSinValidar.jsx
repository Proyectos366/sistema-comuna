import LabelInput from "@/components/inputs/LabelInput";
import Input from "@/components/inputs/Input";

export default function InputNombreSinValidar({
  indice,
  name,
  disabled,
  className,
  placeholder,
  value,
  setValue,
  autoComplete,
  readOnly,
  htmlFor,
  nombre,
}) {
  const leyendoInput = (e) => {
    const valor = e.target.value;

    setValue?.(valor);
  };

  return (
    <LabelInput
      htmlFor={htmlFor ? htmlFor : "nombreSinValidar"}
      nombre={nombre ? nombre : "Nombre"}
    >
      <Input
        type={"text"}
        id={htmlFor ? htmlFor : "nombreSinValidar"}
        value={value}
        name={name}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "socialista"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        indice={indice}
      />
    </LabelInput>
  );
}
