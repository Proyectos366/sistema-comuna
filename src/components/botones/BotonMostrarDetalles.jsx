export default function BotonMostrarDetalles({
  toggleDetalles,
  nombre,
  index,
}) {
  return (
    <button
      onClick={() => toggleDetalles(index)}
      className={`w-full text-left font-semibold tracking-wide uppercase px-6 py-2 rounded-md cursor-pointer transition-colors duration-200
         bg-green-500  text-white
          hover:bg-[#d3dce6] hover:text-[#082158]
         `}
    >
      {nombre}
    </button>
  );
}
