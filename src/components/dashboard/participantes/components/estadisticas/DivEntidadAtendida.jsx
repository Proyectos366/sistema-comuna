import BloqueInfo from "@/components/BloqueInfo";
import Div from "@/components/padres/Div";
import Titulos from "@/components/Titulos";
import { formatearFecha } from "@/utils/Fechas";

export default function DivEntidadAtendida({ datos, entidad, nombre }) {
  return (
    <Div className="mt-2">
      <Titulos indice={6} titulo={entidad} className={"uppercase"} />

      <Div className="flex flex-col gap-2">
        {datos.atendidos.map((dato) => (
          <Div key={dato.id} className="border rounded-md flex flex-col gap-1 p-2">
            <BloqueInfo nombre={nombre} valor={dato.nombre} />

            <BloqueInfo
              nombre={"Parroquia"}
              valor={dato?.parroquia?.nombre}
            />

            <BloqueInfo
              nombre={"Formación"}
              valor={dato?.formacion?.nombre}
            />
            <BloqueInfo
              nombre={"Primera atención"}
              valor={formatearFecha(dato.fecha_primer_atendido)}
            />
            <BloqueInfo
              nombre={"Última atención"}
              valor={formatearFecha(dato.fecha_ultimo_atendido)}
            />
          </Div>
        ))}
      </Div>
    </Div>
  );
}
