"use client";

import { useEffect } from "react";
import SelectOpcion from "../SelectOpcion";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputCheckBox from "../InputCheckBox";
import InputCedula from "../inputs/InputCedula";
import InputNombre from "../inputs/InputNombre";
import InputEdad from "../inputs/InputEdad";
import InputTelefono from "../inputs/InputTelefono";
import InputCorreo from "../inputs/InputCorreo";

export default function FormCrearVocero({
  idComuna,
  idConsejo,
  cambiarSeleccionComunaCircuito,
  cambiarDondeGuardar,
  cambiarSeleccionConsejo,
  toggleGenero,
  comunasCircuitos,
  consejos,
  dondeGuardar,
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
  seleccionarFormacion,
  abrirModal,
  limpiarCampos,
  setNombreComuna,
  setNombreConsejoComunal,
  validarCedula,
  setValidarCedula,
  validarNombre,
  setValidarNombre,
  validarNombreDos,
  setValidarNombreDos,
  validarApellido,
  setValidarApellido,
  validarApellidoDos,
  setValidarApellidoDos,
  validarEdad,
  setValidarEdad,
  validarTelefono,
  setValidarTelefono,
  validarCorreo,
  setValidarCorreo,
  validarActividadLaboral,
  setValidarActividadLaboral,
  setDatos,
}) {
  useEffect(() => {
    if (idConsejo) {
      const consejo = consejos.find((c) => c.id === idConsejo);

      if (consejo) {
        const comuna = comunasCircuitos.find(
          (comuna) => comuna.id === consejo.id_comuna
        );

        if (comuna) {
          setNombreComuna(comuna.nombre);
        }
      }
    }
  }, [idConsejo]);

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
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
        indice={1}
      />

      {dondeGuardar === 1 && (
        <SelectOpcion
          idOpcion={idComuna}
          nombre={"Comunas"}
          handleChange={cambiarSeleccionComunaCircuito}
          opciones={comunasCircuitos}
          seleccione={"Seleccione"}
          setNombre={setNombreComuna}
          setDatos={setDatos}
          indice={1}
        />
      )}

      {dondeGuardar === 3 && (
        <SelectOpcion
          idOpcion={idConsejo}
          nombre={"Consejos comunales"}
          handleChange={cambiarSeleccionConsejo}
          opciones={consejos}
          seleccione={"Seleccione"}
          setNombre={setNombreConsejoComunal}
          setDatos={setDatos}
          indice={1}
        />
      )}

      {(idComuna || idConsejo) && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 gap-x-4">
            <LabelInput nombre={"Cedula"}>
              <InputCedula
                type={"text"}
                indice={"cedula"}
                value={cedula}
                setValue={setCedula}
                validarCedula={validarCedula}
                setValidarCedula={setValidarCedula}
              />
            </LabelInput>

            <LabelInput nombre={"Edad"}>
              <InputEdad
                type={"text"}
                indice={"edad"}
                value={edad}
                setValue={setEdad}
                validarEdad={validarEdad}
                setValidarEdad={setValidarEdad}
              />
            </LabelInput>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 gap-x-4">
            <LabelInput nombre={"Primer nombre"}>
              <InputNombre
                type={"text"}
                indice={"nombre"}
                value={nombre}
                setValue={setNombre}
                validarNombre={validarNombre}
                setValidarNombre={setValidarNombre}
              />
            </LabelInput>

            <LabelInput nombre={"Segundo nombre"}>
              <InputNombre
                type={"text"}
                indice={"nombre"}
                value={nombreDos}
                setValue={setNombreDos}
                validarNombre={validarNombreDos}
                setValidarNombre={setValidarNombreDos}
              />
            </LabelInput>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 gap-x-4">
            <LabelInput nombre={"Primer apellido"}>
              <InputNombre
                type={"text"}
                indice={"nombre"}
                value={apellido}
                setValue={setApellido}
                validarNombre={validarApellido}
                setValidarNombre={setValidarApellido}
              />
            </LabelInput>

            <LabelInput nombre={"Segundo Apellido"}>
              <InputNombre
                type={"text"}
                indice={"nombre"}
                value={apellidoDos}
                setValue={setApellidoDos}
                validarNombre={validarApellidoDos}
                setValidarNombre={setValidarApellidoDos}
              />
            </LabelInput>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 gap-x-4">
            <div className="flex flex-col w-full">
              <span className="text-gray-700 font-medium">Genero</span>
              <div className="flex justify-evenly border border-gray-300 py-2 rounded-md hover:border hover:border-[#082158]">
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

            <LabelInput nombre={"Telefono"}>
              <InputTelefono
                type={"text"}
                indice={"telefono"}
                value={telefono}
                setValue={setTelefono}
                validarTelefono={validarTelefono}
                setValidarTelefono={setValidarTelefono}
              />
            </LabelInput>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 gap-x-4">
            <LabelInput nombre={"Correo"}>
              <InputCorreo
                type="text"
                indice="email"
                value={correo}
                setValue={setCorreo}
                validarCorreo={validarCorreo}
                setValidarCorreo={setValidarCorreo}
              />
            </LabelInput>

            <LabelInput nombre={"Actividad laboral"}>
              <InputNombre
                type="text"
                indice="nombre"
                value={actividadLaboral}
                setValue={setActividadLaboral}
                validarNombre={validarActividadLaboral}
                setValidarNombre={setValidarActividadLaboral}
              />
            </LabelInput>
          </div>

          <div className="hidden gap-2 gap-x-4">
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

          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Formaciones</span>
            {formaciones?.length > 0 && (
              <div className="uppercase block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all">
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
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-gray-700 font-medium">Cargos</span>
            {cargos?.length > 0 && (
              <div className="uppercase flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#082158] focus:border-0 hover:border hover:border-[#082158] focus:outline-none transition-all">
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
            )}
          </div>

          <div className="flex gap-2 gap-x-4">
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
                seleccionarCargo,
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
