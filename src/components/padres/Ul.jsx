export default function Ul({ children, className }) {
  const clasePorDefecto = ``;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return <ul className={nuevaClase}>{children}</ul>;
}
