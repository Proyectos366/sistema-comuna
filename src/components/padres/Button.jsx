export default function Button({
  children,
  className,
  type,
  disabled,
  onClick,
  nombre,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
      {nombre}
    </button>
  );
}
