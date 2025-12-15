"use client";

import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import LabelInput from "@/components/inputs/LabelInput";
import InputNombre from "@/components/inputs/InputNombre";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";
import { cambiarSeleccionComunaCircuitoConsejo } from "@/utils/dashboard/cambiarSeleccionComunaCircuitoConsejo";
import { limpiarCampos } from "@/utils/limpiarForm";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { cambiarSeleccionComuna } from "@/utils/dashboard/cambiarSeleccionComuna";
import { cambiarSeleccionCircuito } from "@/utils/dashboard/cambiarSeleccionCircuito";
import { cambiarSeleccionConsejo } from "@/utils/dashboard/cambiarSeleccionConsejo";
import InputCedula from "../inputs/InputCedula";
import InputEdad from "../inputs/InputEdad";
import OpcionesCrearVocero from "../dashboard/voceros/components/OpcionesCrearVocero";
import AgruparCamposForm from "../AgruparCamposForm";

export default function FormCrearVocero({
  acciones,
  datosVocero,
  validaciones,
  estados,
  municipios,
  parroquias,
}) {
  const dispatch = useDispatch();

  const { comunas } = useSelector((state) => state.comunas);
  const { circuitos } = useSelector((state) => state.circuitos);
  const { consejos } = useSelector((state) => state.consejos);

  const { usuarioActivo } = useSelector((state) => state.auth);
  const { paises } = useSelector((state) => state.paises);

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setIdComuna,
    setIdCircuito,
    setIdConsejo,
    setIdVocero,

    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombreComuna,
    setNombreCircuito,
    setNombreConsejo,

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
    idVocero,

    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombreComuna,
    nombreCircuito,
    nombreConsejo,

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

  const resetOpcion = () => {
    setIdParroquia("");
    setIdComuna("");
    setIdCircuito("");
    setIdConsejo("");
    setNombre("");
  };

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

            <div className="flex space-x-3">
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
            </div>
          </>
        )}
      </DivScroll>
    </Formulario>
  );
}
