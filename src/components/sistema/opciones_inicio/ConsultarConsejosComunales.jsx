import SelectOpcion from "@/components/SelectOpcion";

export default function ConsultarTodosConsejos({
  seleccionarConsulta,
  idConsejo,
  cambiarSeleccionConsejo,
  consejos,
}) {
  return (
    <>
      {seleccionarConsulta === 4 && (
        <SelectOpcion
          idOpcion={idConsejo}
          nombre={"Consejos comunales"}
          handleChange={cambiarSeleccionConsejo}
          opciones={consejos}
          seleccione={"Seleccione"}
        />
      )}
    </>
  );
}
