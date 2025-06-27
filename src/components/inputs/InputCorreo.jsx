import DivMensajeInput from "../mensaje/DivMensaje";
import Input from "./Input";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function InputCorreo({
  type,
  indice,
  name,
  disabled,
  className,
  placeholder,
  id,
  value,
  setValue, // <- nuevo
  autoComplete,
  readOnly,
  ref,
  max,
  validarCorreo,
  setValidarCorreo,
}) {
  const validandoCampos = (campo) => {
    if (indice === "email") {
      return emailRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    setValue?.(valor); // <- actualiza el estado desde fuera, si setValue existe

    if (indice === "email") {
      const esValido = validandoCampos(valor);
      setValidarCorreo?.(esValido);
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
      {indice === "email" && value && !validarCorreo && (
        <DivMensajeInput mensaje={"Formato invalido"} />
      )}
    </div>
  );
}
