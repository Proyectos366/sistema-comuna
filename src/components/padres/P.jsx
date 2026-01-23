export default function P({ children, className, style, onClick, ref }) {
  const clasePorDefecto = ``;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <p className={nuevaClase} style={style} onClick={onClick} ref={ref}>
      {children}
    </p>
  );
}
