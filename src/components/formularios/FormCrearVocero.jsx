import SelectOpcion from "../SelectOpcion";
import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MenuDesplegable from "../MenuDesplegable";

export default function FormCrearVocero({
  idParroquia,
  idComunaCircuito,
  idConsejo,
  cambiarSeleccionParroquia,
  cambiarSeleccionComunaCircuito,
  cambiarDondeGuardar,
  cambiarDondeCrear,
  cambiarSeleccionConsejo,
  parroquias,
  comunasCircuitos,
  consejos,
  dondeGuardar,
  dondeCrear,
  nombre,
  setNombre,
  nombreDos,
  setNombreDos,

  apellido, setApellido,
  apellidoDos, setApellidoDos,
  cedula, setCedula,
  genero, setGenero,
  edad, setEdad,
  telefono, setTelefono,
  direccion, setDireccion,
  correo, setCorreo,
  actividadLaboral, setActividadLaboral,
  seleccionarCargo, setSeleccionarCargo,
  seleccionarFormacion, setSeleccionarFormacion,
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
        nombre={"Crear en"}
        handleChange={cambiarDondeGuardar}
        opciones={[
          { id: 1, nombre: "COMUNA" },
          { id: 2, nombre: "CIRCUITO COMUNAL" },
          { id: 3, nombre: "CONSEJO COMUNAL" },
        ]}
        seleccione={"Seleccione"}
      />

      <MenuDesplegable>
        {dondeGuardar === 3 && (
          <SelectOpcion
            idOpcion={dondeCrear}
            nombre={"Pertenece a"}
            handleChange={cambiarDondeCrear}
            opciones={[
              { id: 1, nombre: "COMUNA" },
              { id: 2, nombre: "CIRCUITO COMUNAL" },
            ]}
            seleccione={"Seleccione"}
          />
        )}

        {dondeGuardar === 3 && dondeCrear && (
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={cambiarSeleccionParroquia}
            opciones={parroquias}
            seleccione={"Seleccione"}
          />
        )}

        {dondeGuardar && dondeGuardar !== 3 && (
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
            nombre={
              dondeGuardar !== 3
                ? dondeGuardar === 1
                  ? "Comunas"
                  : "Circuitos"
                : dondeCrear === 1
                ? "Comunas"
                : "Circuitos"
            }
            handleChange={cambiarSeleccionComunaCircuito}
            opciones={comunasCircuitos}
            seleccione={"Seleccione"}
          />
        )}

        {idComunaCircuito && dondeGuardar === 3 && (
          <SelectOpcion
            idOpcion={idConsejo}
            nombre={"Consejos comunales"}
            handleChange={cambiarSeleccionConsejo}
            opciones={consejos}
            seleccione={"Seleccione"}
          />
        )}
      </MenuDesplegable>

      {(dondeGuardar !== 0 || dondeCrear !== 0) &&
        idParroquia &&
        idComunaCircuito &&
        (dondeGuardar === 3 ? idConsejo : true) && (
          <>

            <LabelInput
              nombre={"Primer nombre"}
              value={nombre}
              setValue={setNombre}
            />
            <LabelInput
              nombre={"Segundo nombre"}
              value={nombreDos}
              setValue={setNombreDos}
            />

            <div className="flex space-x-3">
              <BotonAceptarCancelar
                indice={"aceptar"}
                aceptar={abrirModal}
                nombre={"Crear"}
                campos={{
                  nombre,
                  idParroquia,
                  idComunaCircuito,
                  idConsejo: 0,
                }}
              />

              <BotonAceptarCancelar
                indice={"limpiar"}
                aceptar={() => {
                  limpiarCampos({ setNombre, setNombreDos });
                }}
                nombre={"Limpiar"}
                campos={{
                  nombre,
                  nombreDos,
                  idParroquia,
                  idComunaCircuito,
                  idConsejo: 0,
                }}
              />
            </div>
          </>
        )}
    </Formulario>
  );
}
