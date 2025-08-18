export default function BotonEliminar({ eliminar, indice }) {
  // Verificamos que el índice sea un número válido para Tailwind
  const anchoClase =
    typeof indice === "number" && indice > 0 ? `w-${indice}` : "w-10"; // ancho por defecto si no hay índice válido

  return (
    <button
      onClick={() => eliminar()}
      type="button"
      className={`${anchoClase} flex items-center justify-center p-2 rounded-md
                  bg-[#E61C45] hover:bg-[#082158] transition-all duration-200
                  focus:outline-none cursor-pointer`}
      title="eliminar"
      aria-label="eliminar"
    >
      <img
        src="/img/eliminar.png"
        alt="Eliminar"
        className="w-5 h-5 object-contain"
      />
    </button>
  );
}
