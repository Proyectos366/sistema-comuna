export default function BotonEditar({ editar, indice }) {
  // Verificamos que el índice sea un número válido para Tailwind
  const anchoClase = typeof indice === "number" && indice > 0
    ? `w-${indice}`
    : "w-10"; // ancho por defecto si no hay índice válido

  return (
    <button
      onClick={() => editar()}
      type="button"
      className={`${anchoClase} flex items-center justify-center p-2 rounded-md
                  bg-green-600 hover:bg-blue-900 transition-all duration-200
                  focus:outline-none cursor-pointer`}
      title="Editar"
      aria-label="Editar"
    >
      <img
        src="/img/editar.png"
        alt="Editar"
        className="w-5 h-5 object-contain"
      />
    </button>
  );
}
