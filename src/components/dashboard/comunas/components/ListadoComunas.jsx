import { useDispatch } from "react-redux";
import Image from "next/image";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import Button from "@/components/padres/Button";
import Span from "@/components/padres/Span";
import BloqueInfo from "@/components/BloqueInfo";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarComuna } from "@/store/features/comunas/thunks/eliminarRestaurarComuna";

export default function ListadoComunas({ comuna, editarComuna }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <Div className="flex items-center justify-between gap-2">
        <BloqueInfo indice={1} nombre={"Rif"} valor={comuna.rif} />

        <Button
          title="Editar"
          onClick={() => {
            editarComuna(comuna);
          }}
          className="p-1 sm:px-4 sm:py-1 sm:min-w-28 rounded-md bg-[#082158]  text-white shadow-md hover:scale-105 transition cursor-pointer"
        >
          <Span className="hidden sm:block">Actualizar</Span>
          <Div className="sm:hidden w-6 h-6 flex items-center justify-center">
            <Image
              width={24}
              height={20}
              src="/img/editar.png"
              alt="Imagen del boton editar"
            />
          </Div>
        </Button>
      </Div>

      <BloqueInfo
        indice={1}
        nombre={"Sector"}
        valor={comuna.sector ? comuna.sector : "Sin sector"}
      />
      <BloqueInfo
        indice={1}
        nombre={"Dirección"}
        valor={comuna.direccion ? comuna.direccion : "Sin dirección"}
      />

      <Div className="flex items-center justify-between">
        <BloqueInfo
          indice={!comuna.borrado ? 3 : 2}
          nombre={"Comuna"}
          valor={!comuna.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!comuna.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarComuna({
                estado: comuna.borrado,
                id_comuna: comuna.id,
              })
            );
          }}
        />
      </Div>

      <BloqueInfo
        indice={1}
        nombre={"Creada"}
        valor={formatearFecha(comuna.createdAt)}
      />
    </Div>
  );
}
