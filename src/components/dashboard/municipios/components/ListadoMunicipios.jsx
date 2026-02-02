import { useDispatch } from "react-redux";
import Image from "next/image";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfo from "@/components/BloqueInfo";
import Button from "@/components/padres/Button";
import Span from "@/components/padres/Span";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarMunicipio } from "@/store/features/municipios/thunks/eliminarRestaurarMunicipio";

export default function ListadoMunicipios({ municipio, editarMunicipio }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <Div className="flex items-center justify-between gap-2">
        <BloqueInfo
          indice={1}
          nombre={"Descripción"}
          valor={municipio.descripcion}
        />

        <Button
          title="Editar"
          onClick={() => {
            editarMunicipio(municipio);
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

      <Div className="flex items-center justify-between">
        <BloqueInfo
          indice={!municipio.borrado ? 3 : 2}
          nombre={"municipio"}
          valor={!municipio.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!municipio.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarMunicipio({
                estado: municipio.borrado,
                id_municipio: municipio.id,
              }),
            );
          }}
        />
      </Div>

      <BloqueInfo
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(municipio.createdAt)}
      />
    </Div>
  );
}
