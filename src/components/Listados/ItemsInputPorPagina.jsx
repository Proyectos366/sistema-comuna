export default function ItemsInputPorPagina({
  reducirItems,
  itemsPorPagina,
  setItemsPorPagina,
  incrementarItems,
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full rounded-md">
      {/* <span className="text-sm text-gray-600">Voceros por página</span> */}
      <div className="w-full flex justify-between">
        <button
          onClick={reducirItems}
          className={`${
            itemsPorPagina <= 1 ? "cursor-not-allowed" : "cursor-pointer"
          } bg-[#082158] text-white font-semibold px-2 py-2 rounded-s-md flex-1`}
          disabled={itemsPorPagina <= 1}
        >
          −
        </button>

        <input
          type="text"
          value={itemsPorPagina}
          onChange={(e) => setItemsPorPagina(Number(e.target.value))}
          className="text-center w-2/3 outline-none border border-gray-300 border-x-0"
          min={1}
          max={100}
        />

        <button
          onClick={incrementarItems}
          className="bg-[#082158] text-white font-semibold px-2 py-2 rounded-e-md flex-1 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
