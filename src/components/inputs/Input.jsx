export default function Input({
  type,
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
  readOnly,
  ref,
  max,
  onKeyDown
}) {
  const clasePorDefecto = `${
    indice === "clave" || indice === "clave2" ? "" : "uppercase"
  } block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <input
      type={type}
      id={id}
      value={value}
      name={name}
      disabled={disabled}
      className={nuevaClase}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      readOnly={readOnly}
      ref={ref}
      max={max}
      onKeyDown={onKeyDown}
    />
  );
}
