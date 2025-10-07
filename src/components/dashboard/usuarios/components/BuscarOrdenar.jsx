import Input from "@/components/inputs/Input";
import Div from "@/components/padres/Div";
import OrdenarListaUsuarios from "@/components/dashboard/usuarios/components/OrdenarListaUsuarios";

export default function BuscarOrdenar({
  searchTerm,
  setSearchTerm,
  setFirst,
  ordenCampo,
  setOrdenCampo,
  ordenAscendente,
  setOrdenAscendente,
}) {
  return (
    <Div className="flex flex-col sm:flex-row gap-4 bg-[#eef1f5] rounded-md shadow-lg">
      <Input
        type="text"
        placeholder="🔍 Buscar..."
        value={searchTerm}
        className={`bg-white ps-4 placeholder:px-5`}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setFirst(0);
        }}
      />

      <OrdenarListaUsuarios
        ordenCampo={ordenCampo}
        setOrdenCampo={setOrdenCampo}
        setOrdenAscendente={setOrdenAscendente}
        ordenAscendente={ordenAscendente}
      />
    </Div>
  );
}
