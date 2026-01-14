import { useSelector } from "react-redux";

import SelectOpcion from "@/components/SelectOpcion";

import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

export default function ConsultarVocerosParroquia({
  idParroquia,
  setIdParroquia,
  seleccionado,
}) {
  const { parroquias } = useSelector((state) => state.parroquias);

  return (
    <div className="w-full max-w-md flex flex-col p-2 bg-[#f1f1f1] shadow-lg rounded-md border border-[#918f8f] ">
      {seleccionado === 2 && (
        <>
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={(e) => cambiarSeleccionParroquia(e, setIdParroquia)}
            opciones={parroquias}
            seleccione={"Seleccione"}
          />
        </>
      )}
    </div>
  );
}
