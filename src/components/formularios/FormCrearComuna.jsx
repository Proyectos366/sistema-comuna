import SelectOpcion from "../SelectOpcion";
import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";

export default function FormCrearComuna({
  idParroquia,
  cambiarSeleccionParroquia,
  parroquias,
  nombre,
  setNombre,
  abrirModal,
  limpiarCampos,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <SelectOpcion
        idOpcion={idParroquia}
        nombre={"Parroquias"}
        handleChange={cambiarSeleccionParroquia}
        opciones={parroquias}
        seleccione={"Seleccione"}
      />

      {idParroquia && (
        <>
          <LabelInput nombre={"Nombre"} value={nombre} setValue={setNombre} />

          <div className="flex space-x-3">
            <BotonAceptarCancelar
              indice={"aceptar"}
              aceptar={abrirModal}
              nombre={"Crear"}
              campos={{
                nombre,
                idParroquia,
              }}
            />

            <BotonAceptarCancelar
              indice={"limpiar"}
              aceptar={() => {
                limpiarCampos({ setNombre });
              }}
              nombre={"Limpiar"}
              campos={{
                nombre,
                idParroquia,
              }}
            />
          </div>
        </>
      )}
    </form>
  );
}
