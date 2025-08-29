import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputDescripcion from "../inputs/InputDescripcion";
import InputNombre from "../inputs/InputNombre";
import LabelInput from "../inputs/LabelInput";
import SelectOpcion from "../SelectOpcion";

export default function FormCrearEstado({
  idPais,
  nombre,
  setNombre,
  capital,
  setCapital,
  codigoPostal,
  setCodigoPostal,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
  validarCapital,
  setValidarCapital,
  abrirModal,
  limpiarCampos,
  paises,
  cambiarSeleccionPais,
  setNombrePais,
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

      <LabelInput nombre={"Capital"}>
        <InputNombre
          type="text"
          indice="nombre"
          value={capital}
          setValue={setCapital}
          validarNombre={validarCapital}
          setValidarNombre={setValidarCapital}
        />
      </LabelInput>

      <LabelInput nombre={"Código postal"}>
        <InputNombre
          type="text"
          value={codigoPostal}
          setValue={setCodigoPostal}
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
            capital,
            codigoPostal,
            descripcion,
          }}
        />

        <BotonAceptarCancelar
          indice={"limpiar"}
          aceptar={() => {
            limpiarCampos({
              setNombre,
              setCapital,
              setCodigoPostal,
              setDescripcion,
            });
          }}
          nombre={"Limpiar"}
          campos={{
            nombre,
            capital,
            codigoPostal,
            descripcion,
          }}
        />
      </div>
    </Formulario>
  );
}
