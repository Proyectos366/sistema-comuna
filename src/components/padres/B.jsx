export default function B({ children, className, style, onClick, ref }) {
  const clasePorDefecto = ``;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <b className={nuevaClase} style={style} onClick={onClick} ref={ref}>
      {children}
    </b>
  );
}
