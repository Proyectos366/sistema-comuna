import SelectOpcion from "../SelectOpcion";
import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MenuDesplegable from "../MenuDesplegable";

export default function FormCrearConsejo({
  idParroquia,
  idComunaCircuito,
  cambiarSeleccionParroquia,
  cambiarSeleccionComunaCircuito,
  cambiarDondeGuardar,
  parroquias,
  comunasCircuitos,
  dondeGuardar,
  setDondeGuardar,
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
        idOpcion={dondeGuardar}
        nombre={"Donde crear el consejo comunal"}
        handleChange={cambiarDondeGuardar}
        opciones={[
          { id: 1, nombre: "Comuna" },
          { id: 2, nombre: "Circuito" },
        ]}
        seleccione={"Seleccione"}
      />
      <MenuDesplegable>
        {dondeGuardar !== 0 && (
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={cambiarSeleccionParroquia}
            opciones={parroquias}
            seleccione={"Seleccione"}
          />
        )}

        {dondeGuardar !== 0 && idParroquia && (
          <SelectOpcion
            idOpcion={idComunaCircuito}
            nombre={dondeGuardar === 1 ? "Comunas" : "Circuitos"}
            handleChange={cambiarSeleccionComunaCircuito}
            opciones={comunasCircuitos}
            seleccione={"Seleccione"}
          />
        )}
      </MenuDesplegable>

      {dondeGuardar !== 0 && idParroquia && idComunaCircuito && (
        <>
          <LabelInput nombre={"Nombre"} value={nombre} setValue={setNombre} />

          <div className="flex space-x-3">
            <BotonAceptarCancelar
              indice={"aceptar"}
              aceptar={abrirModal}
              nombre={"Crear"}
              campos={{
                nombre,
                idParroquia,
                idComunaCircuito,
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
                idComunaCircuito,
              }}
            />
          </div>
        </>
      )}
    </Formulario>
  );
}
