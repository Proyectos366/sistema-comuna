export default function InputDescripcion({
  indice,
  name,
  disabled,
  className,
  placeholder,
  id,
  onChange,
  value,
  setValue,
  autoComplete,
  row,
  readOnly,
  ref,
  max,
}) {
  const leyendoInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reinicia altura
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta a contenido

    const valor = textarea.value;
    setValue?.(valor);
    onChange?.(e); // Por si necesitas manejar el evento desde fuera
  };

  const clasePorDefecto = `block w-full px-2 uppercase border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all overflow-hidden resize-none`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <div className="space-y-2 relative">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={leyendoInput}
        disabled={disabled}
        className={nuevaClase}
        placeholder={
          placeholder ? placeholder : "Escribe una descripción detallada..."
        }
        autoComplete={autoComplete}
        readOnly={readOnly}
        ref={ref}
        maxLength={max}
        rows={row}
        indice={indice}
        style={{ height: "auto" }}
      />
    </div>
  );
}

/** 
  export default function InputDescripcion({
    indice,
    name,
    disabled,
    className,
    placeholder,
    id,
    onChange,
    value,
    setValue,
    autoComplete,
    row,
    readOnly,
    ref,
    max,
  }) {
    const leyendoInput = (e) => {
      const valor = e.target.value;
      setValue?.(valor);
      onChange?.(e); // Por si necesitas manejar el evento desde fuera
    };

    const clasePorDefecto = `block w-full px-2 uppercase border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all`;
    const nuevaClase = className
      ? `${clasePorDefecto} ${className}`
      : clasePorDefecto;

    return (
      <div className="space-y-2 relative">
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={leyendoInput}
          disabled={disabled}
          className={nuevaClase}
          placeholder={
            placeholder ? placeholder : "Escribe una descripción detallada..."
          }
          autoComplete={autoComplete}
          readOnly={readOnly}
          ref={ref}
          maxLength={max}
          rows={row}
          indice={indice}
        />
      </div>
    );
  }
*/
