import Formulario from "../Formulario";
import SelectOpcion from "../SelectOpcion";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";
import Input from "../inputs/Input";

export default function FormCrearComuna({
  idParroquia,
  cambiarSeleccionParroquia,
  parroquias,
  nombre,
  setNombre,
  setNombreParroquia,
  abrirModal,
  limpiarCampos,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <SelectOpcion
        idOpcion={idParroquia}
        nombre={"Parroquias"}
        handleChange={cambiarSeleccionParroquia}
        opciones={parroquias}
        seleccione={"Seleccione"}
        indice={1}
        setNombre={setNombreParroquia}
      />

      {idParroquia && (
        <>
          <LabelInput nombre={"Nombre"}>
            <Input
              type={"text"}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </LabelInput>

          <div className="flex space-x-3">
            <BotonAceptarCancelar
              indice={"aceptar"}
              aceptar={abrirModal}
              nombre={"Crear"}
              campos={{
                nombre,
                idParroquia,
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
        </>
      )}
    </Formulario>
  );
}
