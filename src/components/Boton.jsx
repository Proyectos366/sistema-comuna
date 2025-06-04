export default function Boton({ type, nombre, className, disabled, onClick }) {
  const clasePorDefecto = `${
    !disabled ? "cursor-pointer" : "cursor-not-allowed"
  } hover:font-bold font-medium border border-black rounded-md w-full transition-all ease-in-out duration-500`;
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
