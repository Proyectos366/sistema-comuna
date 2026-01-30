import BloqueInfo from "@/components/BloqueInfo";
import Div from "@/components/padres/Div";
import Titulos from "@/components/Titulos";
import { formatearFecha } from "@/utils/Fechas";

export default function DivEntidadNoAtendida({ datos, entidad, nombre }) {
  return (
    <Div className="mt-2">
      <Titulos indice={6} titulo={entidad} className={"uppercase"} />

      <Div className="flex flex-col gap-2">
        {datos.no_atendidos.map((dato) => (
          <Div
            key={dato.id}
            className="border rounded-md flex flex-col gap-1 p-2"
          >
            <BloqueInfo nombre={nombre} valor={dato.nombre} />

            <BloqueInfo
              nombre={"Parroquia"}
              valor={dato?.parroquia?.nombre}
            />
          </Div>
        ))}
      </Div>
    </Div>
  );
}
