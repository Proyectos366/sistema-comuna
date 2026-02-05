import SelectOpcion from "@/components/SelectOpcion";
import { cambiarSeleccionCircuito } from "@/utils/dashboard/cambiarSeleccionCircuito";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";
import { useSelector } from "react-redux";

export default function ConsultarVocerosCircuito({
  idParroquia,
  setIdParroquia,
  idCircuito,
  setIdCircuito,
  seleccionado,
}) {
  const { circuitos } = useSelector((state) => state.circuitos);
  const { parroquias } = useSelector((state) => state.parroquias);

  return (
    <div className="w-full max-w-md flex flex-col p-2 bg-[#f1f1f1] shadow-lg rounded-md border border-[#918f8f] ">
      {seleccionado === 4 && (
        <>
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={(e) => cambiarSeleccionParroquia(e, setIdParroquia)}
            opciones={parroquias}
            seleccione={"Seleccione"}
          />

          {idParroquia && (
            <SelectOpcion
              idOpcion={idCircuito}
              nombre={"Circuitos"}
              handleChange={(e) => cambiarSeleccionCircuito(e, setIdCircuito)}
              opciones={circuitos}
              seleccione={"Seleccione"}
            />
          )}
        </>
      )}
    </div>
  );
}
