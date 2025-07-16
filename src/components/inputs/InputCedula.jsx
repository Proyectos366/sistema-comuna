import DivMensajeInput from "../mensaje/DivMensaje";
import Input from "./Input";

const cedulaRegex = /^[1-9][0-9]{6,7}$/; // acepta de 7 a 8 dígitos, sin puntos ni prefijo

export default function InputCedula({
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
  validarCedula,
  setValidarCedula,
  setValue,
  titulo,
}) {
  // Elimina puntos y prefijo V-
  const limpiarCedula = (valor) => valor.replace(/^V-/, "").replace(/\./g, "");

  // Añade puntos cada 3 dígitos y prepende V-
  const formatearCedula = (valor) => {
    const soloNumeros = valor.replace(/\D/g, "");
    const conPuntos = soloNumeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `V-${conPuntos}`;
  };

  const leyendoInput = (e) => {
    const valorEntrada = e.target.value;

    // Elimina prefijo y puntos para validar
    const cedulaSinFormato = limpiarCedula(valorEntrada);

    // Si no queda ningún número, borra todo el valor
    if (cedulaSinFormato.length === 0) {
      setValue?.("");
      setValidarCedula?.(false);
      onChange?.(e);
      return;
    }

    // Validación previa
    if (
      indice === "cedula" &&
      (cedulaSinFormato.startsWith("0") ||
        /[^0-9]/.test(cedulaSinFormato) ||
        cedulaSinFormato.length > 8)
    ) {
      return;
    }

    const cedulaFormateada = formatearCedula(cedulaSinFormato);
    setValue?.(cedulaFormateada);

    if (indice === "cedula") {
      const esValida = cedulaRegex.test(cedulaSinFormato);
      setValidarCedula?.(esValida);
    }

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
        placeholder={placeholder ? placeholder : "inserte cédula"}
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={ref}
        max={max}
        indice={indice}
      />

      {indice === "cedula" && value && !validarCedula && (
        <DivMensajeInput mensaje="Cédula inválida" />
      )}
    </div>
  );
}

/**
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
*/
