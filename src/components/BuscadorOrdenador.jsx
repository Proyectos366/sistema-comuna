import Input from "@/components/inputs/Input";
import Div from "@/components/padres/Div";
import OrdenarLista from "@/components/OrdenarLista";

export default function BuscadorOrdenador({
  busqueda,
  setBusqueda,
  ordenCampo,
  setOrdenCampo,
  ordenDireccion,
  setOrdenDireccion,
  opcionesOrden,
}) {
  return (
    <Div className="flex flex-col sm:flex-row gap-4 bg-[#eef1f5] rounded-md shadow-lg">
      <Input
        type="text"
        placeholder="🔍 Buscar..."
        value={busqueda}
        className={`bg-white ps-4 placeholder:px-5`}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <OrdenarLista
        ordenCampo={ordenCampo}
        setOrdenCampo={setOrdenCampo}
        setOrdenDireccion={setOrdenDireccion}
        ordenDireccion={ordenDireccion}
        opcionesOrden={opcionesOrden}
      />
    </Div>
  );
}
