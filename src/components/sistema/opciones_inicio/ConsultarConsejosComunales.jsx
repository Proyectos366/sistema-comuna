import SelectOpcion from "@/components/SelectOpcion";
import { cambiarSeleccionConsejo } from "@/utils/dashboard/cambiarSeleccionConsejo";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";
import { useSelector } from "react-redux";

export default function ConsultarVocerosConsejo({
  idParroquia,
  setIdParroquia,
  idConsejo,
  setIdConsejo,
  seleccionado,
}) {
  const { consejos } = useSelector((state) => state.consejos);
  const { parroquias } = useSelector((state) => state.parroquias);

  return (
    <div className="w-full max-w-md flex flex-col p-2 bg-[#f1f1f1] shadow-lg rounded-md border border-[#918f8f] ">
      {seleccionado === 5 && (
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
              idOpcion={idConsejo}
              nombre={"Consejos"}
              handleChange={(e) => cambiarSeleccionConsejo(e, setIdConsejo)}
              opciones={consejos}
              seleccione={"Seleccione"}
            />
          )}
        </>
      )}
    </div>
  );
}
