import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";

export default function FormCrearClase({ abrirModal, nombre, setNombre }) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <>
        <div className="">
          <LabelInput nombre={"Nombre"} value={nombre} setValue={setNombre} />
        </div>

        <div className="flex space-x-4">
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
              limpiarCampos({
                setNombre,
              });
            }}
            nombre={"Limpiar"}
            campos={{
              nombre,
            }}
          />
        </div>
      </>
    </Formulario>
  );
}
