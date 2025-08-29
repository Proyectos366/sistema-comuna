import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputDescripcion from "../inputs/InputDescripcion";
import InputNombre from "../inputs/InputNombre";
import LabelInput from "../inputs/LabelInput";

export default function FormCrearDepartamento({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  abrirModal,
  limpiarCampos,
  validarNombre,
  setValidarNombre,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
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
            descripcion,
          }}
        />

        <BotonAceptarCancelar
          indice={"limpiar"}
          aceptar={() => {
            limpiarCampos({ setNombre, setDescripcion });
          }}
          nombre={"Limpiar"}
          campos={{
            nombre,
            descripcion,
          }}
        />
      </div>
    </Formulario>
  );
}
