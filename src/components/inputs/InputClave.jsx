const claveRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,16}$/;

export default function InputClave({
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
  validarClave,
  setValidarClave,
}) {
  const validandoCampos = (campo) => {
    if (indice === "clave") {
      return claveRegex.test(campo);
    }
  };

  const leyendoInput = (e) => {
    const valor = e.target.value;
    onChange(e);

    if (indice === "clave") {
      const esValido = validandoCampos(valor);
      if (esValido) {
        setValidarClave(true);
      } else {
        setValidarClave(false);
      }
    }
  };

  const clasePorDefecto = `mt-1 uppercase block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all`;
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

      {/* 
      {indice === "clave" && value && !validarClave && (
        <div className="text-[#e35f63] text-xl text-center shadow-[0px_2px_4px_#e35f63] bg-white font-semibold border border-[#e35f63] rounded-md px-4 py-2">
          Formato clave incorrecto
        </div>
      )} */}
    </div>
  );
}
