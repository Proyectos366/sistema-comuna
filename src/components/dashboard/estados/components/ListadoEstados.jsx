import { useDispatch } from "react-redux";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfo from "@/components/BloqueInfo";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarEstado } from "@/store/features/estados/thunks/eliminarRestaurarEstado";

export default function ListadoEstados({ estado }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <BloqueInfo indice={1} nombre={"Capital"} valor={estado.capital} />

      <BloqueInfo
        indice={1}
        nombre={"Codigo postal"}
        valor={estado.cod_postal}
      />

      <Div className="flex items-center justify-between">
        <BloqueInfo
          indice={!estado.borrado ? 3 : 2}
          nombre={"Estado"}
          valor={!estado.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!estado.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarEstado({
                estado: estado.borrado,
                id_estado: estado.id,
              })
            );
          }}
        />
      </Div>

      <BloqueInfo
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(estado.createdAt)}
      />
    </Div>
  );
}
