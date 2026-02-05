import { useEffect } from "react";
import { useSelector } from "react-redux";

import SelectOpcion from "@/components/SelectOpcion";

import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

export default function ConsultarVocerosComuna({
  idParroquia,
  setIdParroquia,
  idComuna,
  setIdComuna,
  seleccionado,
}) {
  const { comunas } = useSelector((state) => state.comunas);
  const { parroquias } = useSelector((state) => state.parroquias);

  useEffect(() => {
    setIdComuna("");
  }, [idParroquia]);

  return (
    <div className="w-full max-w-md flex flex-col p-2 bg-[#f1f1f1] shadow-lg rounded-md border border-[#918f8f] ">
      {seleccionado === 3 && (
        <>
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={(e) => cambiarSeleccionParroquia(e, setIdParroquia)}
            opciones={parroquias}
            seleccione={"Seleccione"}
            indice={1}
          />

          {idParroquia && (
            <SelectOpcion
              idOpcion={idComuna}
              nombre={"Comunas"}
              handleChange={(e) => cambiarSeleccionComuna(e, setIdComuna)}
              opciones={comunas}
              seleccione={"Seleccione"}
            />
          )}
        </>
      )}
    </div>
  );
}
