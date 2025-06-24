import SelectOpcion from "../SelectOpcion";
import LabelInput from "../LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import MenuDesplegable from "../MenuDesplegable";
import InputCheckBox from "../InputCheckBox";

export default function FormCrearCursando({
  idParroquia,
  idComunaCircuito,
  idConsejo,
  cambiarSeleccionParroquia,
  cambiarSeleccionComunaCircuito,
  cambiarDondeGuardar,
  cambiarDondeCrear,
  cambiarSeleccionConsejo,
  toggleGenero,
  parroquias,
  comunasCircuitos,
  consejos,
  dondeGuardar,
  dondeCrear,
  nombre,
  setNombre,
  nombreDos,
  setNombreDos,
  apellido,
  setApellido,
  apellidoDos,
  setApellidoDos,
  cedula,
  setCedula,
  genero,
  setGenero,
  edad,
  setEdad,
  telefono,
  setTelefono,
  direccion,
  setDireccion,
  correo,
  setCorreo,
  actividadLaboral,
  setActividadLaboral,
  cargos,
  toggleCargo,
  formaciones,
  toggleFormaciones,
  seleccionarCargo,
  setSeleccionarCargo,
  seleccionarFormacion,
  setSeleccionarFormacion,
  abrirModal,
  limpiarCampos,
  setNombreComuna,
  setNombreConsejoComunal,
}) {
  return (
    /** 
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
        opciones={[{ id: 1, nombre: "COMUNA" }]}
        seleccione={"Seleccione"}
      />

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

      {(dondeGuardar !== 0 || dondeCrear !== 0) &&
        idParroquia &&
        idComunaCircuito &&
        (dondeGuardar === 3 ? idConsejo : true) && (
          <>
            <div className="flex justify-between">
              <LabelInput
                nombre={"Cedula"}
                value={cedula}
                setValue={setCedula}
              />
              <LabelInput nombre={"Edad"} value={edad} setValue={setEdad} />
            </div>

            <div className="flex justify-between">
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
            </div>

            <div className="flex justify-between">
              <LabelInput
                nombre={"Primer apellido"}
                value={apellido}
                setValue={setApellido}
              />
              <LabelInput
                nombre={"Segundo apellido"}
                value={apellidoDos}
                setValue={setApellidoDos}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col w-full">
                <span>Genero</span>
                <div className="flex justify-evenly border border-gray-300 py-2 mt-1 rounded-md hover:border hover:border-[#082158]">
                  {[
                  { id: 1, nombre: "Masculino" },
                  { id: 2, nombre: "Femenino" },
                ].map((opcion) => (
                  <InputCheckBox
                  altura={5}
                    key={opcion.id}
                    id={opcion.id}
                    nombre={opcion.nombre}
                    isChecked={genero === opcion.id} // Solo una opción puede estar seleccionada
                    onToggle={() => toggleGenero(opcion.id)} // Cambia el estado con la opción elegida
                  />
                ))}
                </div>
              </div>

              <LabelInput
                nombre={"Telefono"}
                value={telefono}
                setValue={setTelefono}
              />
            </div>

            <div className="flex justify-between">
              <LabelInput
                nombre={"Correo"}
                value={correo}
                setValue={setCorreo}
              />
              <LabelInput
                nombre={"Actividad laboral"}
                value={actividadLaboral}
                setValue={setActividadLaboral}
              />
            </div>

            <div className="hidden">
              <LabelInput
                nombre={"Direccion"}
                value={direccion}
                setValue={setDireccion}
              />
              <div className="grid grid-cols-2 gap-4">
                {cargos?.map((cargo) => (
                  <InputCheckBox
                    key={cargo.id}
                    id={cargo.id}
                    nombre={cargo.nombre}
                    isChecked={seleccionarCargo.includes(cargo.id)}
                    onToggle={toggleCargo}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="grid grid-cols-2 gap-4">
                {formaciones?.map((formacion) => (
                  <InputCheckBox
                    key={formacion.id}
                    id={formacion.id}
                    nombre={formacion.nombre}
                    isChecked={seleccionarFormacion.includes(formacion.id)}
                    onToggle={toggleFormaciones}
                  />
                ))}
              </div>
            </div>

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
                  limpiarCampos({
                    setCedula,
                    setEdad,
                    setNombre,
                    setNombreDos,
                  });
                }}
                nombre={"Limpiar"}
                campos={{
                  cedula,
                  edad,
                  nombre,
                  nombreDos,
                }}
              />
            </div>
          </>
        )}
    </Formulario>
    */
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
            opciones={[{ id: 1, nombre: "COMUNA" }]}
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
            setNombre={setNombreComuna}
          />
        )}

        {idComunaCircuito && dondeGuardar === 3 && (
          <SelectOpcion
            idOpcion={idConsejo}
            nombre={"Consejos comunales"}
            handleChange={cambiarSeleccionConsejo}
            opciones={consejos}
            seleccione={"Seleccione"}
            setNombre={setNombreConsejoComunal}
          />
        )}
      </MenuDesplegable>

      {(dondeGuardar !== 0 || dondeCrear !== 0) &&
        idParroquia &&
        idComunaCircuito &&
        (dondeGuardar === 3 ? idConsejo : true) && (
          <>
            <div className="flex flex-col sm:flex-row justify-between space-x-4">
              <LabelInput
                nombre={"Cedula"}
                value={cedula}
                setValue={setCedula}
              />
              <LabelInput nombre={"Edad"} value={edad} setValue={setEdad} />
            </div>

            <div className="flex flex-col sm:flex-row space-x-4">
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
            </div>

            <div className="flex flex-col sm:flex-row space-x-4">
              <LabelInput
                nombre={"Primer apellido"}
                value={apellido}
                setValue={setApellido}
              />
              <LabelInput
                nombre={"Segundo apellido"}
                value={apellidoDos}
                setValue={setApellidoDos}
              />
            </div>

            <div className="flex flex-col sm:flex-row space-x-4">
              <div className="flex flex-col w-full">
                <span>Genero</span>
                <div className="flex justify-evenly border border-gray-300 py-2 mt-1 rounded-md hover:border hover:border-[#082158]">
                  {[
                    { id: 1, nombre: "Masculino" },
                    { id: 2, nombre: "Femenino" },
                  ].map((opcion) => (
                    <InputCheckBox
                      altura={5}
                      key={opcion.id}
                      id={opcion.id}
                      nombre={opcion.nombre}
                      isChecked={genero === opcion.id} // Solo una opción puede estar seleccionada
                      onToggle={() => toggleGenero(opcion.id)} // Cambia el estado con la opción elegida
                    />
                  ))}
                </div>
              </div>

              <LabelInput
                nombre={"Telefono"}
                value={telefono}
                setValue={setTelefono}
              />
            </div>

            <div className="flex flex-col sm:flex-row space-x-4">
              <LabelInput
                nombre={"Correo"}
                value={correo}
                setValue={setCorreo}
              />
              <LabelInput
                nombre={"Actividad laboral"}
                value={actividadLaboral}
                setValue={setActividadLaboral}
              />
            </div>

            <div className="hidden  space-x-4">
              <LabelInput
                nombre={"Direccion"}
                value={direccion}
                setValue={setDireccion}
              />
              <div className="grid grid-cols-2 gap-4">
                {cargos?.map((cargo) => (
                  <InputCheckBox
                    key={cargo.id}
                    id={cargo.id}
                    nombre={cargo.nombre}
                    isChecked={seleccionarCargo.includes(cargo.id)}
                    onToggle={toggleCargo}
                  />
                ))}
              </div>
            </div>

            <div className="flex">
              <div className="mt-1 uppercase block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all">
                {formaciones?.map((formacion) => (
                  <InputCheckBox
                    key={formacion.id}
                    id={formacion.id}
                    nombre={formacion.nombre}
                    isChecked={seleccionarFormacion.includes(formacion.id)}
                    onToggle={toggleFormaciones}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <BotonAceptarCancelar
                indice={"aceptar"}
                aceptar={abrirModal}
                nombre={"Crear"}
                campos={{
                  cedula,
                  nombre,
                  apellido,
                  edad,
                  genero,
                  telefono,
                  correo,
                  actividadLaboral,
                  seleccionarFormacion,
                  idParroquia,
                  idComunaCircuito,
                  idConsejo: 0,
                }}
              />

              <BotonAceptarCancelar
                indice={"limpiar"}
                aceptar={() => {
                  limpiarCampos({
                    setCedula,
                    setEdad,
                    setNombre,
                    setNombreDos,
                    setApellido,
                    setApellidoDos,
                    setGenero,
                    setTelefono,
                    setCorreo,
                    setActividadLaboral,
                  });
                }}
                nombre={"Limpiar"}
                campos={{
                  cedula,
                  edad,
                  nombre,
                  nombreDos,
                  apellido,
                  apellidoDos,
                  genero,
                  telefono,
                  correo,
                  actividadLaboral,
                }}
              />
            </div>
          </>
        )}
    </Formulario>
  );
}

/**
 // Este formulario estara activo cuando ya se tengan los consejos comunales y se pueda
 // separar cada persona donde pertenece

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
            <div className="flex justify-between">
              <LabelInput
                nombre={"Cedula"}
                value={cedula}
                setValue={setCedula}
              />
              <LabelInput nombre={"Edad"} value={edad} setValue={setEdad} />
            </div>

            <div className="flex justify-between">
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
            </div>

            <div className="flex justify-between">
              <LabelInput
                nombre={"Primer apellido"}
                value={apellido}
                setValue={setApellido}
              />
              <LabelInput
                nombre={"Segundo apellido"}
                value={apellidoDos}
                setValue={setApellidoDos}
              />
            </div>

            <div className="flex justify-between">
              <LabelInput
                nombre={"Genero"}
                value={genero}
                setValue={setGenero}
              />
              <LabelInput
                nombre={"Telefono"}
                value={telefono}
                setValue={setTelefono}
              />
            </div>

            <div className="flex justify-between">
              <LabelInput
                nombre={"Correo"}
                value={correo}
                setValue={setCorreo}
              />
              <LabelInput
                nombre={"Actividad laboral"}
                value={actividadLaboral}
                setValue={setActividadLaboral}
              />
            </div>

            <div className="hidden">
              <LabelInput
                nombre={"Direccion"}
                value={direccion}
                setValue={setDireccion}
              />
              <div className="grid grid-cols-2 gap-4">
                {cargos?.map((cargo) => (
                  <InputCheckBox
                    key={cargo.id}
                    id={cargo.id}
                    nombre={cargo.nombre}
                    isChecked={seleccionarCargo.includes(cargo.id)}
                    onToggle={toggleCargo}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="grid grid-cols-2 gap-4">
                {formaciones?.map((formacion) => (
                  <InputCheckBox
                    key={formacion.id}
                    id={formacion.id}
                    nombre={formacion.nombre}
                    isChecked={seleccionarFormacion.includes(formacion.id)}
                    onToggle={toggleFormaciones}
                  />
                ))}
              </div>
            </div>

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
 */
