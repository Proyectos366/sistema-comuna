import SelectOpcion from "../SelectOpcion";
import Formulario from "../Formulario";
import LabelInput from "../inputs/LabelInput";
import Input from "../inputs/Input";
import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";

export default function FormCrearCircuito({
  idParroquia,
  cambiarSeleccionParroquia,
  parroquias,
  nombre,
  setNombre,
  abrirModal,
  limpiarCampos,
}) {
  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-4"
    >
      <SelectOpcion
        idOpcion={idParroquia}
        nombre={"Parroquias"}
        handleChange={cambiarSeleccionParroquia}
        opciones={parroquias}
        seleccione={"Seleccione"}
        indice={1}
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
                idParroquia,
              }}
            />
          </div>
        </>
      )}
    </Formulario>
  );
}
