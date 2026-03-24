import { useDispatch } from "react-redux";
import Image from "next/image";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import Button from "@/components/padres/Button";
import Span from "@/components/padres/Span";
import BloqueInfo from "@/components/BloqueInfo";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarEstante } from "@/store/features/estantes/thunks/eliminarRestaurarEstante";
import { abrirModal } from "@/store/features/modal/slicesModal";

export default function ListadoEstantes({ estante, editarEstante, setOpcion, setIdEstante, setBorradoRestaurado }) {
  const dispatch = useDispatch();

  //console.log(estante);

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <Div className="flex items-center justify-between gap-2">
        <BloqueInfo
          indice={1}
          nombre={"Descripción"}
          valor={estante.descripcion}
        />

        <Button
          title="Editar"
          onClick={() => {
            editarEstante(estante);
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

      <BloqueInfo indice={1} nombre={"Alias"} valor={estante.alias} />
      <BloqueInfo indice={1} nombre={"Código"} valor={estante.codigo} />
      <BloqueInfo indice={1} nombre={"Niveles"} valor={estante.nivel} />
      <BloqueInfo indice={1} nombre={"Secciones"} valor={estante.seccion} />
      <BloqueInfo
        indice={1}
        nombre={"Carpetas"}
        valor={estante._count.carpetas}
      />
      <BloqueInfo
        indice={1}
        nombre={"Archivos"}
        valor={estante._count.archivos}
      />
      <BloqueInfo
        indice={1}
        nombre={"Tamaño total"}
        valor={estante.pesoTotalEstante}
      />

      <Div className="flex items-center justify-between">
        <BloqueInfo
          indice={!estante.borrado ? 3 : 2}
          nombre={"estante"}
          valor={!estante.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!estante.borrado}
          onToggle={() => {
            setOpcion('eliminar')
            setIdEstante(estante.id);
            setBorradoRestaurado(estante.borrado);
            dispatch(abrirModal("confirmar"));            
            // dispatch(
            //   eliminarRestaurarEstante({
            //     estado: estante.borrado,
            //     id_estante: estante.id,
            //   }),
            // );
          }}
        />
      </Div>

      <BloqueInfo
        indice={1}
        nombre={"Creada"}
        valor={formatearFecha(estante.createdAt)}
      />
    </Div>
  );
}
