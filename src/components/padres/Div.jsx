export default function Div({
  children,
  className,
  style,
  onClick,
  ref,
  onMouseEnter,
  onMouseLeave,
}) {
  const clasePorDefecto = ``;

  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <div
      className={nuevaClase}
      style={style}
      onClick={onClick}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
