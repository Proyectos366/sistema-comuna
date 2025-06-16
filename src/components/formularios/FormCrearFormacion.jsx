import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";

export default function FormCrearFormacion({
  nombre,
  setNombre,
  modulo,
  setModulo,
  abrirModal,
  limpiarCampos,
  validar,
  setValidar,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <LabelInput nombre={"Nombre"} value={nombre} setValue={setNombre} />
      <LabelInput
        indice={"numero"}
        validar={validar}
        setValidar={setValidar}
        nombre={"Cantidad de modulos"}
        value={modulo}
        setValue={setModulo}
      />

      <div className="flex space-x-3">
        <BotonAceptarCancelar
          indice={"aceptar"}
          aceptar={abrirModal}
          nombre={"Crear"}
          campos={{
            nombre,
            modulo,
          }}
        />

        <BotonAceptarCancelar
          indice={"limpiar"}
          aceptar={() => {
            limpiarCampos({ setNombre, setModulo });
          }}
          nombre={"Limpiar"}
          campos={{
            nombre,
            modulo,
          }}
        />
      </div>
    </Formulario>
  );
}
