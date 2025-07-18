import Input from "./Input";
import DivMensajeInput from "../mensaje/DivMensaje";

export default function InputTelefono({
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
  validarTelefono,
  setValidarTelefono,
  setValue,
}) {
  // Prefijos válidos: móviles y fijos
  const prefijosValidos = ["0412", "0414", "0416", "0424", "0426"];

  const formatoTelefono = (valor) => {
    const soloNumeros = valor.replace(/\D/g, "").slice(0, 11);

    if (soloNumeros.length <= 4) return soloNumeros;
    if (soloNumeros.length <= 7)
      return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
    if (soloNumeros.length <= 9)
      return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(
        4,
        7
      )}.${soloNumeros.slice(7)}`;
    return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(
      4,
      7
    )}.${soloNumeros.slice(7, 9)}.${soloNumeros.slice(9, 11)}`;
  };

  const validandoCampos = (campo) => {
    const soloNumeros = campo.replace(/\D/g, "");
    return /^(02\d{2}|04(12|14|16|24|26))\d{7}$/.test(soloNumeros);
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;
    const soloNumeros = valor.replace(/\D/g, "");

    if (soloNumeros === "") {
      setValue("");
      setValidarTelefono(false);
      return;
    }

    if (!/^\d+$/.test(soloNumeros)) return;
    if (soloNumeros.charAt(0) !== "0") return;
    if (soloNumeros.length >= 2 && !/[24]/.test(soloNumeros.charAt(1))) return;
    if (soloNumeros.length > 11) return;

    // Validar prefijo completo
    if (soloNumeros.length >= 4) {
      const prefijo = soloNumeros.slice(0, 4);
      if (!prefijosValidos.includes(prefijo)) return;
    }

    const formateado = formatoTelefono(soloNumeros);
    setValue(formateado);

    if (indice === "telefono") {
      const esValido = validandoCampos(formateado);
      setValidarTelefono(esValido);
    }

    onChange?.(e);
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

      {indice === "telefono" && value && !validarTelefono && (
        <DivMensajeInput mensaje="Debe tener 11 dígitos válidos (ej: 0414-123.45.67)" />
      )}
    </div>
  );
}

/** 
  import Input from "./Input";
  import DivMensajeInput from "../mensaje/DivMensaje";

  export default function InputTelefono({
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
    validarTelefono,
    setValidarTelefono,
    setValue,
  }) {
    const formatoTelefono = (valor) => {
      const soloNumeros = valor.replace(/\D/g, "").slice(0, 11);

      if (soloNumeros.length <= 4) return soloNumeros;
      if (soloNumeros.length <= 7)
        return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(4)}`;
      if (soloNumeros.length <= 9)
        return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(
          4,
          7
        )}.${soloNumeros.slice(7)}`;
      return `${soloNumeros.slice(0, 4)}-${soloNumeros.slice(
        4,
        7
      )}.${soloNumeros.slice(7, 9)}.${soloNumeros.slice(9, 11)}`;
    };

    const validandoCampos = (campo) => {
      const soloNumeros = campo.replace(/\D/g, "");
      return /^(02\d{2}|04(12|14|16|24|26))\d{7}$/.test(soloNumeros);
    };

    const leyendoInput = (e) => {
      const valor = e.target.value;
      const soloNumeros = valor.replace(/\D/g, "");

      // Permitir borrar
      if (soloNumeros === "") {
        setValue("");
        setValidarTelefono(false);
        return;
      }

      // Solo permitir dígitos
      if (!/^\d+$/.test(soloNumeros)) return;

      // No permitir si el primer dígito no es 0
      if (soloNumeros.length >= 1 && soloNumeros.charAt(0) !== "0") return;

      // No permitir si el segundo dígito no es 2 o 4 (cuando existe)
      if (soloNumeros.length >= 2 && !/[24]/.test(soloNumeros.charAt(1))) return;

      // No permitir más de 11 dígitos
      if (soloNumeros.length > 11) return;

      const formateado = formatoTelefono(soloNumeros);
      setValue(formateado);

      if (indice === "telefono") {
        const esValido = validandoCampos(formateado);
        setValidarTelefono(esValido);
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

        {indice === "telefono" && value && !validarTelefono && (
          <DivMensajeInput
            mensaje={"Debe tener 11 dígitos (ej: 0414-123.45.67)"}
          />
        )}
      </div>
    );
  }
*/
