export default function BotonSelecOpcionVocero({
  consultar,
  seleccionar,
  nombre,
  indice
}) {
  return (
    <button
      onClick={() => consultar()}
      className={`w-full px-4 py-2 rounded-md  cursor-pointer transition hover:scale-105 duration-500 ${
        seleccionar === indice
          ? "bg-[#082158] text-white shadow-md"
          : "border border-gray-300 bg-[white]  hover:bg-[#082158] hover:border-[#082158] hover:text-white"
      }`}
    >
      {nombre}
    </button>
  );
}
