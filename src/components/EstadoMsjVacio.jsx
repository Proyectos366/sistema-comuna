import Div from "@/components/padres/Div";

export default function EstadoMsjVacio({ dato, loading, titulo }) {
  return (
    <>
      {dato.length !== 0 && (
        <Div
          className={`text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold`}
        >
          No hay coincidencias...
        </Div>
      )}

      {!loading && dato.length === 0 && (
        <Div className="text-[#E61C45] text-lg border border-[#E61C45] rounded-md shadow-lg px-5 py-1 font-semibold">
          {titulo ? titulo : "No hay registros..."}
        </Div>
      )}
    </>
  );
}
