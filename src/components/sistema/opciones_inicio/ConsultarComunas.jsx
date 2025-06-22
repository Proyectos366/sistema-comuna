import SelectOpcion from "@/components/SelectOpcion";

export default function ConsultarTodasComunas({
  seleccionarConsulta,
  idComuna,
  cambiarSeleccionComuna,
  comunas,
}) {
  return (
    <>
      {seleccionarConsulta === 3 && (
        <SelectOpcion
          idOpcion={idComuna}
          nombre={"Comunas"}
          handleChange={cambiarSeleccionComuna}
          opciones={comunas}
          seleccione={"Seleccione"}
        />
      )}
    </>
  );
}
