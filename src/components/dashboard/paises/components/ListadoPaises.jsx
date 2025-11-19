import { useDispatch } from "react-redux";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfoPais from "@/components/dashboard/paises/components/BloqueInfoPais";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarPais } from "@/store/features/paises/thunks/eliminarRestaurarPais";

export default function ListadoPaises({ pais }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <BloqueInfoPais indice={1} nombre={"Capital"} valor={pais.capital} />

      <Div className="flex items-center justify-between">
        <BloqueInfoPais
          indice={!pais.borrado ? 3 : 2}
          nombre={"Estado"}
          valor={!pais.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!pais.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarPais({
                estado: pais.borrado,
                id_pais: pais.id,
              })
            );
          }}
        />
      </Div>

      <BloqueInfoPais
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(pais.createdAt)}
      />
    </Div>
  );
}
