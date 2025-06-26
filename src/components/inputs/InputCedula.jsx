import DivMensajeInput from "../mensaje/DivMensaje";

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

  const clasePorDefecto = `uppercase block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <div className="space-y-2 relative">
      <input
        type={type}
        id={id}
        value={value}
        name={name}
        disabled={disabled}
        className={nuevaClase}
        onChange={leyendoInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={ref}
        max={max}
      />
      {indice === "cedula" && value && !validarCedula && (
        <DivMensajeInput mensaje={'Cédula inválida'} />
      )}
    </div>
  );
}

/**
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
  const validandoCampos = (campo) => {
    if (indice === "cedula") {
      return cedulaRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    setValue?.(valor);

    if (
      indice === "cedula" &&
      (valor.startsWith("0") || /[^0-9]/.test(valor))
    ) {
      return;
    }

    if (indice === "cedula") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarCedula(true);
      } else {
        setValidarCedula(false);
      }
    }
  };

  const clasePorDefecto = `uppercase block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <div className="space-y-2">
      <input
        type={type}
        id={id}
        value={value}
        name={name}
        disabled={disabled}
        className={nuevaClase}
        onChange={leyendoInput}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={ref}
        max={max}
      />

      {indice === "cedula" && value && !validarCedula && indice !== 10 && (
        <div className="text-[#e35f63] absolute text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Cédula inválida
        </div>
      )}
    </div>
  );
}
 */
