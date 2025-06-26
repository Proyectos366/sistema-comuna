const textRegex = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/;

export default function InputNombre({
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
  validarNombre,
  setValidarNombre,
}) {
  const validandoCampos = (campo) => {
    if (indice === "nombre") {
      return textRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;

    onChange(e);

    if (indice === "nombre") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarNombre(true);
      } else {
        setValidarNombre(false);
      }
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

      {indice === "nombre" && value && !validarNombre && (
        <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Solo letras
        </div>
      )}
    </div>
  );
}
