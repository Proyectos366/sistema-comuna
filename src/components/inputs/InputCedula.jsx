import DivMensajeInput from "../mensaje/DivMensaje";
import Input from "./Input";

const cedulaRegex = /^[1-9][0-9]{6,7}$/;

export default function InputCedula({
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
  validarCedula,
  setValidarCedula,
  setValue,
}) {
  const desformatearCedula = (valor) => valor.replace(/\./g, "");

  const formatearCedula = (valor) => {
    const limpio = desformatearCedula(valor);
    return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const leyendoInput = (e) => {
    const sinPuntos = e.target.value.replace(/\./g, "");

    if (
      indice === "cedula" &&
      (sinPuntos.startsWith("0") ||
        /[^0-9]/.test(sinPuntos) ||
        sinPuntos.length > 8)
    ) {
      return; // previene ingreso no deseado
    }

    const conFormato = formatearCedula(sinPuntos);
    setValue?.(conFormato);

    if (indice === "cedula") {
      const esValido = cedulaRegex.test(sinPuntos);
      setValidarCedula?.(esValido);
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
        placeholder={"Inserte cédula"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={ref}
        max={max}
        indice={indice}
      />

      {indice === "cedula" && value && !validarCedula && (
        <DivMensajeInput mensaje={"Cédula inválida"} />
      )}
    </div>
  );
}
