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
  onKeyDown,
  title,
}) {
  const clasePorDefecto = `${
    indice === "clave" || indice === "clave2" ? "" : "uppercase"
  } block w-full p-2 outline ${
    readOnly
      ? "outline-[#3B82F6] text-[#3B82F6]"
      : "outline-[#d1d5dc] hover:outline-[#082158]"
  } rounded-md shadow-sm   focus:outline placeholder:text-xs placeholder:opacity-40 transition-all`;
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
      title={readOnly ? "Este campo es de solo lectura" : title}
    />
  );
}
