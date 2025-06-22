import SelectOpcion from "@/components/SelectOpcion";

export default function ConsultarTodasParroquias({
  seleccionarConsulta,
  idParroquia,
  cambiarSeleccionParroquia,
  parroquias,
}) {
  return (
    <>
      {seleccionarConsulta === 2 && (
        <SelectOpcion
          idOpcion={idParroquia}
          nombre={"Parroquias"}
          handleChange={cambiarSeleccionParroquia}
          opciones={parroquias}
          seleccione={"Seleccione"}
        />
      )}
    </>
  );
}
