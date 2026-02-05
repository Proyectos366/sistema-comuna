export default function Header({ children, className, style, onClick, ref }) {
  const clasePorDefecto = ``;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <header className={nuevaClase} style={style} onClick={onClick} ref={ref}>
      {children}
    </header>
  );
}
