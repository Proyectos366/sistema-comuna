export default function Section({ children, className, style, onClick, ref }) {
  const clasePorDefecto = ``;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <section className={nuevaClase} style={style} onClick={onClick} ref={ref}>
      {children}
    </section>
  );
}
