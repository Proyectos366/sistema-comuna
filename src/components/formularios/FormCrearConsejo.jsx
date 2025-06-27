import SelectOpcion from "../SelectOpcion";
import Formulario from "../Formulario";
import LabelInput from "../inputs/LabelInput";
import Input from "../inputs/Input";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
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
        nombre={"Pertenece a"}
        handleChange={cambiarDondeGuardar}
        opciones={[
          { id: 1, nombre: "COMUNA" },
          { id: 2, nombre: "CIRCUITO COMUNAL" },
        ]}
        seleccione={"Seleccione"}
        indice={1}
      />
      <MenuDesplegable>
        {dondeGuardar !== 0 && (
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={cambiarSeleccionParroquia}
            opciones={parroquias}
            seleccione={"Seleccione"}
            indice={1}
          />
        )}

        {dondeGuardar !== 0 && idParroquia && (
          <SelectOpcion
            idOpcion={idComunaCircuito}
            nombre={dondeGuardar === 1 ? "Comunas" : "Circuitos"}
            handleChange={cambiarSeleccionComunaCircuito}
            opciones={comunasCircuitos}
            seleccione={"Seleccione"}
            indice={1}
          />
        )}
      </MenuDesplegable>

      {dondeGuardar !== 0 && idParroquia && idComunaCircuito && (
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
