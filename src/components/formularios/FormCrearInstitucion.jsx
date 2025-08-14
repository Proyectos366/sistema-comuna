import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import Input from "../inputs/Input";
import InputNombre from "../inputs/InputNombre";
import InputRif from "../inputs/InputRif";
import LabelInput from "../inputs/LabelInput";
import SelectOpcion from "../SelectOpcion";

export default function FormCrearInstitucion({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  rif,
  setRif,
  sector,
  setSector,
  direccion,
  setDireccion,
  abrirModal,
  limpiarCampos,
  validarNombre,
  setValidarNombre,
  validarRif,
  setValidarRif,
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

      {idPais && idEstado && idMunicipio && (
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
            <InputNombre
              type="text"
              value={descripcion}
              setValue={setDescripcion}
            />
          </LabelInput>

          <LabelInput nombre={"Rif"}>
            <InputRif
              type="text"
              indice="rif"
              value={rif}
              setValue={setRif}
              validarRif={validarRif}
              setValidarRif={setValidarRif}
            />
          </LabelInput>

          <LabelInput nombre={"Sector"}>
            <Input
              type={"text"}
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
          </LabelInput>

          <LabelInput nombre={"Dirección"}>
            <Input
              type={"text"}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
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
            rif,
            sector,
            direccion,
          }}
        />

        <BotonAceptarCancelar
          indice={"limpiar"}
          aceptar={() => {
            limpiarCampos({
              setNombre,
              setDescripcion,
              setRif,
              setSector,
              setDireccion,
            });
          }}
          nombre={"Limpiar"}
          campos={{
            nombre,
            descripcion,
            rif,
            sector,
            direccion,
          }}
        />
      </div>
    </Formulario>
  );
}
