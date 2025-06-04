export default function Label({ htmlFor, nombre, className }) {
  const clasePorDefecto = ` text-xl`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <label className={nuevaClase} htmlFor={htmlFor}>
      {nombre}
    </label>
  );
}
