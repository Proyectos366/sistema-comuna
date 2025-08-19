import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputNombre from "../inputs/InputNombre";
import LabelInput from "../inputs/LabelInput";
import SelectOpcion from "../SelectOpcion";

export default function FormCrearNovedad({
  usuarioActivo,
  idInstitucion,
  idDepartamento,
  idPrioridad,

  setIdInstitucion,
  setIdDepartamento,
  setIdPrioridad,

  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
  instituciones,
  departamentos,
  setNombreDepartamento,
  setNombreInstitucion,
  setNombrePrioridad,

  cambiarSeleccionDepartamento,
  cambiarSeleccionInstitucion,
  cambiarSeleccionPrioridad,

  abrirModal,
  limpiarCampos,
}) {
  const id = usuarioActivo.id_rol === 1 ? idInstitucion : idDepartamento;
  const setId =
    usuarioActivo.id_rol === 1 ? setIdInstitucion : setIdDepartamento;

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      {usuarioActivo.id_rol === 1 && (
        <SelectOpcion
          idOpcion={idInstitucion}
          nombre={"Instituciones"}
          handleChange={cambiarSeleccionInstitucion}
          opciones={instituciones}
          seleccione={"Seleccione"}
          setNombre={setNombreInstitucion}
          indice={1}
        />
      )}

      {usuarioActivo.id_rol !== 1 && (
        <SelectOpcion
          idOpcion={idDepartamento}
          nombre={"Departamentos"}
          handleChange={cambiarSeleccionDepartamento}
          opciones={departamentos}
          seleccione={"Seleccione"}
          setNombre={setNombreDepartamento}
          indice={1}
        />
      )}

      <SelectOpcion
        idOpcion={idPrioridad}
        nombre={"Prioridad"}
        handleChange={cambiarSeleccionPrioridad}
        opciones={[
          { id: 1, nombre: "alta" },
          { id: 2, nombre: "media" },
          { id: 3, nombre: "baja" },
        ]}
        seleccione={"Seleccione"}
        setNombre={setNombrePrioridad}
        indice={1}
      />

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
        <InputNombre
          type="text"
          value={descripcion}
          setValue={setDescripcion}
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
            id,
          }}
        />

        <BotonAceptarCancelar
          indice={"limpiar"}
          aceptar={() => {
            limpiarCampos({ setNombre, setDescripcion, setId });
          }}
          nombre={"Limpiar"}
          campos={{
            nombre,
            descripcion,
            id,
          }}
        />
      </div>
    </Formulario>
  );
}
