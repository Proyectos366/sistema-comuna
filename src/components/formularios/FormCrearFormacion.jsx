import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputNombre from "../inputs/InputNombre";
import InputModulo from "../inputs/InputModulo";
import LabelInput from "../inputs/LabelInput";
import InputDescripcion from "../inputs/InputDescripcion";

export default function FormCrearFormacion({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
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

      <LabelInput nombre={"Descripción"}>
        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
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
            descripcion,
          }}
        />

        <BotonAceptarCancelar
          indice={"limpiar"}
          aceptar={() => {
            limpiarCampos({ setNombre, setModulo, setDescripcion });
          }}
          nombre={"Limpiar"}
          campos={{
            nombre,
            modulo,
            descripcion,
          }}
        />
      </div>
    </Formulario>
  );
}
