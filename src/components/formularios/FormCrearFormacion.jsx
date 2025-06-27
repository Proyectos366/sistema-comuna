import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputNombre from "../inputs/InputNombre";
import InputModulo from "../inputs/InputModulo";
import LabelInput from "../inputs/LabelInput";

export default function FormCrearFormacion({
  nombre,
  setNombre,
  modulo,
  setModulo,
  abrirModal,
  limpiarCampos,
  validarNombre,
  setValidarNombre,
  validarModulo,
  setValidarModulo,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <LabelInput nombre={"Nombre"}>
        <InputNombre
          type="text"
          indice="nombre"
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />
      </LabelInput>

      <LabelInput nombre={"Cantidad de modulos"}>
        <InputModulo
          type="text"
          indice="modulo"
          value={modulo}
          setValue={setModulo}
          validarModulo={validarModulo}
          setValidarModulo={setValidarModulo}
        />
      </LabelInput>

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
