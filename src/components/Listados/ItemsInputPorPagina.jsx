export default function ItemsInputPorPagina({
  reducirItems,
  itemsPorPagina,
  setItemsPorPagina,
  incrementarItems,
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full border border-gray-300 rounded-md p-1">
      <span className="text-sm text-gray-600">Voceros por página</span>
      <div className="w-full flex justify-between">
        <button
          onClick={reducirItems}
          className={`${
            itemsPorPagina <= 1 ? "cursor-not-allowed" : "cursor-pointer"
          } bg-blue-600 px-2 py-1 rounded-s-md flex-1`}
          disabled={itemsPorPagina <= 1}
        >
          −
        </button>
        <input
          type="number"
          value={itemsPorPagina}
          onChange={(e) => setItemsPorPagina(Number(e.target.value))}
          className="text-center w-1/2 outline-none border border-gray-300 border-x-0"
          min={1}
          max={100}
        />
        <button
          onClick={incrementarItems}
          className="bg-blue-600 px-2 py-1 rounded-e-md flex-1 cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
