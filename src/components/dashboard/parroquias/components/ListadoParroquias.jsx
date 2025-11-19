import { useDispatch } from "react-redux";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfoParroquia from "@/components/dashboard/parroquias/components/BloqueInfoParroquia";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarParroquia } from "@/store/features/parroquias/thunks/eliminarRestaurarParroquia";

export default function ListadoParroquias({ parroquia }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <BloqueInfoParroquia
        indice={1}
        nombre={"Descripción"}
        valor={parroquia.descripcion}
      />

      <Div className="flex items-center justify-between">
        <BloqueInfoParroquia
          indice={!parroquia.borrado ? 3 : 2}
          nombre={"parroquia"}
          valor={!parroquia.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!parroquia.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarParroquia({
                estado: parroquia.borrado,
                id_parroquia: parroquia.id,
              })
            );
          }}
        />
      </Div>

      <BloqueInfoParroquia
        indice={1}
        nombre={"Creada"}
        valor={formatearFecha(parroquia.createdAt)}
      />
    </Div>
  );
}
