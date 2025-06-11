import SelectOpcion from "../SelectOpcion";
import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";

export default function FormCrearParroquia({
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
      <LabelInput nombre={"Nombre"} value={nombre} setValue={setNombre} />

      <div className="flex space-x-3">
        <BotonAceptarCancelar
          indice={"aceptar"}
          aceptar={abrirModal}
          nombre={"Crear"}
          campos={{
            nombre,
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
          }}
        />
      </div>
    </form>
  );
}
