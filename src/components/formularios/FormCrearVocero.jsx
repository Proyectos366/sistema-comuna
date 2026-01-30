"use client";

import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import OpcionesCrearVocero from "@/components/dashboard/voceros/components/OpcionesCrearVocero";
import InputCedula from "@/components/inputs/InputCedula";
import InputEdad from "@/components/inputs/InputEdad";
import InputNombre from "@/components/inputs/InputNombre";
import InputTelefono from "@/components/inputs/InputTelefono";
import InputCorreo from "@/components/inputs/InputCorreo";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

import { limpiarCampos } from "@/utils/limpiarForm";
import { cambiarSeleccionGenero } from "@/utils/dashboard/cambiarSeleccionGenero";
import { cambiarSeleccionCargo } from "@/utils/dashboard/cambiarSeleccionCargo";
import { cambiarSeleccionFormacion } from "@/utils/dashboard/cambiarSeleccionFormacion";

export default function FormCrearVocero({
  acciones,
  datosVocero,
  validaciones,
  seleccionado,
}) {
  const dispatch = useDispatch();

  const { cargos } = useSelector((state) => state.cargos);
  const { formaciones } = useSelector((state) => state.formaciones);

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setIdComuna,
    setIdCircuito,
    setIdConsejo,
    setIdCargo,
    setIdFormacion,
    setIdVocero,

    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombreComuna,
    setNombreCircuito,
    setNombreConsejo,
    setNombreCargo,
    setNombreFormacion,

    setCedula,
    setNombre,
    setNombreDos,
    setApellido,
    setApellidoDos,
    setGenero,
    setEdad,
    setTelefono,
    setCorreo,
    setLaboral,
    setOpcion,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    idComuna,
    idCircuito,
    idConsejo,
    idCargo,
    idFormacion,
    idVocero,

    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
    nombreCircuito,
    nombreConsejo,
    nombreCargo,
    nombreFormacion,

    cedula,
    nombre,
    nombreDos,
    apellido,
    apellidoDos,
    genero,
    edad,
    telefono,
    correo,
    laboral,
    opcion,
  } = datosVocero;

  const {
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
    validarLaboral,
    setValidarLaboral,
  } = validaciones;

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <DivScroll>
        <OpcionesCrearVocero
          acciones={acciones}
          datosVocero={datosVocero}
          validaciones={validaciones}
          seleccionado={seleccionado}
          indice={0}
        />

        {(opcion === "comuna"
          ? idComuna
          : opcion === "circuito"
            ? idCircuito
            : idConsejo) && (
          <>
            <AgruparCamposForm>
              <InputCedula
                value={cedula}
                setValue={setCedula}
                validarCedula={validarCedula}
                setValidarCedula={setValidarCedula}
              />

              <InputEdad
                value={edad}
                setValue={setEdad}
                validarEdad={validarEdad}
                setValidarEdad={setValidarEdad}
              />
            </AgruparCamposForm>

            <AgruparCamposForm>
              <InputNombre
                indice="nombre"
                nombre={"Nombre"}
                value={nombre}
                setValue={setNombre}
                validarNombre={validarNombre}
                setValidarNombre={setValidarNombre}
                placeholder={"Daniela"}
              />

              <InputNombre
                indice="nombre"
                nombre={"Segundo nombre"}
                value={nombreDos}
                setValue={setNombreDos}
                validarNombre={validarNombreDos}
                setValidarNombre={setValidarNombreDos}
                placeholder={"Estefania"}
              />
            </AgruparCamposForm>

            <AgruparCamposForm>
              <InputNombre
                indice="nombre"
                nombre={"Apellido"}
                value={apellido}
                setValue={setApellido}
                validarNombre={validarApellido}
                setValidarNombre={setValidarApellido}
                placeholder={"Morgado"}
              />

              <InputNombre
                indice="nombre"
                nombre={"Segundo apellido"}
                value={apellidoDos}
                setValue={setApellidoDos}
                validarNombre={validarApellidoDos}
                setValidarNombre={setValidarApellidoDos}
                placeholder={"Peraza"}
              />
            </AgruparCamposForm>

            <AgruparCamposForm>
              <SelectOpcion
                idOpcion={genero}
                nombre={"Genero"}
                handleChange={(e) => {
                  cambiarSeleccionGenero(e, setGenero);
                }}
                opciones={[
                  { id: "1", nombre: "Masculino" },
                  { id: "2", nombre: "Femenino" },
                ]}
                seleccione={"Seleccione"}
              />

              <InputTelefono
                value={telefono}
                setValue={setTelefono}
                validarTelefono={validarTelefono}
                setValidarTelefono={setValidarTelefono}
              />
            </AgruparCamposForm>

            <AgruparCamposForm>
              <InputCorreo
                value={correo}
                setValue={setCorreo}
                validarCorreo={validarCorreo}
                setValidarCorreo={setValidarCorreo}
              />

              <InputNombre
                indice="nombre"
                nombre={"Actividad laboral"}
                value={laboral}
                setValue={setLaboral}
                validarNombre={validarLaboral}
                setValidarNombre={setValidarLaboral}
                placeholder={"Ejemplo: contraloria social"}
              />
            </AgruparCamposForm>

            <AgruparCamposForm>
              <SelectOpcion
                idOpcion={idCargo}
                nombre={"Cargos"}
                handleChange={(e) => {
                  cambiarSeleccionCargo(e, setIdCargo);
                }}
                opciones={cargos}
                seleccione={"Seleccione"}
                setNombre={setNombreCargo}
              />

              <SelectOpcion
                idOpcion={idFormacion}
                nombre={"Formaciones"}
                handleChange={(e) => {
                  cambiarSeleccionFormacion(e, setIdFormacion);
                }}
                opciones={formaciones}
                seleccione={"Seleccione"}
                setNombre={setNombreFormacion}
              />
            </AgruparCamposForm>

            <AgruparCamposForm>
              <BotonAceptarCancelar
                indice={"aceptar"}
                aceptar={() => {
                  dispatch(cerrarModal("crear"));
                  dispatch(abrirModal("confirmar"));
                }}
                nombre={"Crear"}
                campos={{
                  nombre,
                  id:
                    opcion === "comuna"
                      ? idComuna
                      : opcion === "circuito"
                        ? idCircuito
                        : idConsejo,
                }}
              />

              <BotonLimpiarCampos
                aceptar={() => {
                  limpiarCampos({ setNombre });
                }}
                campos={{
                  nombre,
                  id:
                    opcion === "comuna"
                      ? idComuna
                      : opcion === "circuito"
                        ? idCircuito
                        : idConsejo,
                }}
              />
            </AgruparCamposForm>
          </>
        )}
      </DivScroll>
    </Formulario>
  );
}
