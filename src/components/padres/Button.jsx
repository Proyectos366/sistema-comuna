export default function Button({
  children,
  className,
  type,
  disabled,
  onClick,
  nombre,
  title,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      title={title}
    >
      {children}
      {nombre}
    </button>
  );
}
