import DivMensajeInput from "../mensaje/DivMensaje";
import Input from "./Input";

const rifRegex = /^[VEJPGCL]-\d{8}-\d$/; // formato válido: letra-8dígitos-dígito

export default function InputRif({
  type,
  indice,
  name,
  disabled,
  className,
  placeholder,
  id,
  value,
  onChange,
  autoComplete,
  readOnly,
  ref,
  max,
  validarRif,
  setValidarRif,
  setValue,
  titulo,
}) {
  // Elimina guiones y letras para validar
  const limpiarRif = (valor) =>
    valor.replace(/[^0-9]/g, "").slice(0, 9); // 8 dígitos + verificador

  // Formatea el RIF con guiones y letra inicial
  const formatearRif = (valor) => {
    const soloNumeros = valor.replace(/\D/g, "");
    const cuerpo = soloNumeros.slice(0, 8);
    const verificador = soloNumeros.slice(8, 9);
    return `J-${cuerpo}-${verificador}`; // Puedes ajustar la letra según el tipo
  };

  const leyendoInput = (e) => {
    const valorEntrada = e.target.value;

    // Limpia para validar
    const rifSinFormato = limpiarRif(valorEntrada);

    if (rifSinFormato.length < 9) {
      setValue?.(valorEntrada);
      setValidarRif?.(false);
      onChange?.(e);
      return;
    }

    const rifFormateado = formatearRif(rifSinFormato);
    setValue?.(rifFormateado);

    const esValido = rifRegex.test(rifFormateado);
    setValidarRif?.(esValido);

    onChange?.(e);
  };

  return (
    <div className="space-y-2 relative" title={titulo}>
      <Input
        type={type}
        id={id}
        value={value}
        name={name}
        disabled={disabled}
        className={className}
        onChange={leyendoInput}
        placeholder={placeholder ? placeholder : "inserte RIF"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={ref}
        max={max}
        indice={indice}
      />

      {indice === "rif" && value && !validarRif && (
        <DivMensajeInput mensaje="RIF inválido" />
      )}
    </div>
  );
}