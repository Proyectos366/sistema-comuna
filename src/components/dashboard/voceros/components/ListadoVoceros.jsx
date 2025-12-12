import { useDispatch } from "react-redux";
import Image from "next/image";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import Button from "@/components/padres/Button";
import Span from "@/components/padres/Span";
import BloqueInfo from "@/components/BloqueInfo";

import { formatearFecha } from "@/utils/Fechas";

import { eliminarRestaurarVocero } from "@/store/features/voceros/thunks/eliminarRestaurarVocero";

export default function ListadoVoceros({ vocero, editarVocero }) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <Div className="flex items-center justify-between gap-2">
        <BloqueInfo indice={1} nombre={"Cédula"} valor={vocero.cedula} />

        <Button
          title="Editar"
          onClick={() => {
            editarVocero(vocero);
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
        nombre={"Genero"}
        valor={vocero.genero ? "Masculino" : "Femenino"}
      />

      <BloqueInfo indice={1} nombre={"Correo"} valor={vocero.correo} />

      <BloqueInfo indice={1} nombre={"Edad"} valor={vocero.edad} />

      <BloqueInfo indice={1} nombre={"Teléfono"} valor={vocero.telefono} />

      <Div className="flex items-center justify-between">
        <BloqueInfo
          indice={!vocero.borrado ? 3 : 2}
          nombre={"vocero"}
          valor={!vocero.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!vocero.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarVocero({
                estado: vocero.borrado,
                id_vocero: vocero.id,
              })
            );
          }}
        />
      </Div>

      <BloqueInfo
        indice={1}
        nombre={"Creado"}
        valor={formatearFecha(vocero.createdAt)}
      />
    </Div>
  );
}
