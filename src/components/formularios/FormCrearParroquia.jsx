import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputDescripcion from "../inputs/InputDescripcion";
import InputNombre from "../inputs/InputNombre";
import LabelInput from "../inputs/LabelInput";
import SelectOpcion from "../SelectOpcion";

export default function FormCrearParroquia({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  abrirModal,
  limpiarCampos,
  validarNombre,
  setValidarNombre,
  paises,
  estados,
  municipios,
  idPais,
  idEstado,
  idMunicipio,
  setNombrePais,
  setNombreEstado,
  setNombreMunicipio,
  cambiarSeleccionPais,
  cambiarSeleccionEstado,
  cambiarSeleccionMunicipio,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <SelectOpcion
        idOpcion={idPais}
        nombre={"Paises"}
        handleChange={cambiarSeleccionPais}
        opciones={paises}
        seleccione={"Seleccione"}
        setNombre={setNombrePais}
        indice={1}
      />

      {idPais && (
        <SelectOpcion
          idOpcion={idEstado}
          nombre={"Estados"}
          handleChange={cambiarSeleccionEstado}
          opciones={estados}
          seleccione={"Seleccione"}
          setNombre={setNombreEstado}
          indice={1}
        />
      )}

      {idEstado && (
        <SelectOpcion
          idOpcion={idMunicipio}
          nombre={"Municipios"}
          handleChange={cambiarSeleccionMunicipio}
          opciones={municipios}
          seleccione={"Seleccione"}
          setNombre={setNombreMunicipio}
          indice={1}
        />
      )}

      {idMunicipio && (
        <>
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
        </>
      )}

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
