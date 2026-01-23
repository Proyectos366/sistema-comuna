export default function Strong({ children, className, style, onClick, ref }) {
  const clasePorDefecto = ``;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <strong className={nuevaClase} style={style} onClick={onClick} ref={ref}>
      {children}
    </strong>
  );
}
