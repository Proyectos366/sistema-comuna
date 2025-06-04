export default function InputBuscador({ buscador, manejarCambioBuscador }) {
  return (
    <input
      className={`shadow-md pl-3 h-10 rounded-md text-xl font-semibold border border-black w-full
                  outline-none focus:border-2 hover:border-2
                   placeholder:text-[gray]  placeholder:opacity-50
                  transition-all duration-300 ease-in-out`}
      type="text"
      name="buscador"
      value={buscador}
      onChange={manejarCambioBuscador}
      placeholder="Buscar..."
    />
  );
}
