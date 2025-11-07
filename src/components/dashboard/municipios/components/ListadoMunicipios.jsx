import { useDispatch } from "react-redux";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfoMunicipio from "@/components/dashboard/municipios/components/BloqueInfoMunicipio";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarMunicipio } from "@/store/features/municipios/thunks/eliminarRestaurarMunicipio";

export default function ListadoMunicipios({ municipio }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <BloqueInfoMunicipio
        indice={1}
        nombre={"Descripción"}
        valor={municipio.descripcion}
      />

      <Div className="flex items-center justify-between">
        <BloqueInfoMunicipio
          indice={!municipio.borrado ? 3 : 2}
          nombre={"municipio"}
          valor={!municipio.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!municipio.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarMunicipio({
                municipio: municipio.borrado,
                id_municipio: municipio.id,
              })
            );
          }}
        />
      </Div>

      <BloqueInfoMunicipio
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(municipio.createdAt)}
      />
    </Div>
  );
}
