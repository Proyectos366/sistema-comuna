export default function Boton({ type, nombre, className, disabled, onClick }) {
  const clasePorDefecto = `${
    !disabled ? "cursor-pointer" : "cursor-not-allowed"
  } w-full font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105`;
  const nuevaClase = className
    ? `${clasePorDefecto} ${className}`
    : clasePorDefecto;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={nuevaClase}
    >
      {nombre}
    </button>
  );
}
