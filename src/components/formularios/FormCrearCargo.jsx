import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";

export default function FormCrearCargo({
  nombre,
  setNombre,
  abrirModal,
  limpiarCampos,
}) {
  return (
    <Formulario
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
    </Formulario>
  );
}
