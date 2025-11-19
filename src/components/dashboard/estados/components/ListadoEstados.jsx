import { useDispatch } from "react-redux";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfoEstado from "@/components/dashboard/estados/components/BloqueInfoEstado";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarEstado } from "@/store/features/estados/thunks/eliminarRestaurarEstado";

export default function ListadoEstados({ estado }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <BloqueInfoEstado indice={1} nombre={"Capital"} valor={estado.capital} />

      <BloqueInfoEstado
        indice={1}
        nombre={"Codigo postal"}
        valor={estado.cod_postal}
      />

      <Div className="flex items-center justify-between">
        <BloqueInfoEstado
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

      <BloqueInfoEstado
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(estado.createdAt)}
      />
    </Div>
  );
}
