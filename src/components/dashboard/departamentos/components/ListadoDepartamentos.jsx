import { useDispatch } from "react-redux";

import SwitchToggle from "@/components/SwitchToggle";
import Div from "@/components/padres/Div";
import BloqueInfoDepartamento from "@/components/dashboard/departamentoscomponents/BloqueInfoDepartamento";

import { formatearFecha } from "@/utils/Fechas";
import { eliminarRestaurarDepartamento } from "@/store/features/departamentosthunks/eliminarRestaurarDepartamento";
import Button from "@/components/padres/Button";
import Span from "@/components/padres/Span";
import Image from "next/image";



export default function ListadoInstituciones({
  institucion,
  editarInstitucion,
}) {
  const dispatch = useDispatch();

  return (
    <Div className="bg-white py-2 px-2 sm:px-4 text-sm sm:text-md flex flex-col gap-1 text-black rounded-b-md">
      <Div className="flex items-center justify-between gap-2">
        <BloqueInfoDepartamento
          indice={1}
          nombre={"Descripción"}
          valor={institucion.descripcion}
        />

        <Button
          title="Editar"
          onClick={() => {
            editarInstitucion(institucion);
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

      <BloqueInfoDepartamento
        indice={1}
        nombre={"Rif"}
        valor={institucion.rif}
      />

      <BloqueInfoDepartamento
        indice={1}
        nombre={"Sector"}
        valor={institucion.sector}
      />
      <BloqueInfoDepartamento
        indice={1}
        nombre={"Dirección"}
        valor={institucion.direccion}
      />

      <Div className="flex items-center justify-between">
        <BloqueInfoDepartamento
          indice={!institucion.borrado ? 3 : 2}
          nombre={"Institución"}
          valor={!institucion.borrado ? "Activo" : "Inactivo"}
        />

        <SwitchToggle
          checked={!institucion.borrado}
          onToggle={() => {
            dispatch(
              eliminarRestaurarDepartamento({
                estado: institucion.borrado,
                id_institucion: institucion.id,
              })
            );
          }}
        />
      </Div>

      <BloqueInfoDepartamento
        indice={1}
        nombre={"Creada"}
        valor={formatearFecha(institucion.createdAt)}
      />
    </Div>
  );
}
