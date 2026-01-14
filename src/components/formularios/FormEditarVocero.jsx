"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputCedula from "@/components/inputs/InputCedula";
import InputEdad from "@/components/inputs/InputEdad";
import InputNombre from "@/components/inputs/InputNombre";
import InputTelefono from "@/components/inputs/InputTelefono";
import InputCorreo from "@/components/inputs/InputCorreo";
import SelectOpcion from "@/components/SelectOpcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { validarEditarVocero } from "@/components/dashboard/voceros/functions/validarEditarVocero";

import { limpiarCampos } from "@/utils/limpiarForm";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";

export default function FormEditarConsejo({
  acciones,
  datosVocero,
  validaciones,
}) {
  const dispatch = useDispatch();

  const { cargos } = useSelector((state) => state.cargos);
  const { formaciones } = useSelector((state) => state.formaciones);

  useEffect(() => {
    validarEditarVocero(datosVocero, validaciones, acciones);
  }, [datosVocero]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <DivScroll>
        <AgruparCamposForm>
          <InputCedula
            value={datosVocero.cedula}
            setValue={acciones.setCedula}
            validarCedula={validaciones.validarCedula}
            setValidarCedula={validaciones.setValidarCedula}
          />

          <InputEdad
            value={datosVocero.edad}
            setValue={acciones.setEdad}
            validarEdad={validaciones.validarEdad}
            setValidarEdad={validaciones.setValidarEdad}
          />
        </AgruparCamposForm>

        <AgruparCamposForm>
          <InputNombre
            indice="nombre"
            nombre={"Nombre"}
            value={datosVocero.nombre}
            setValue={acciones.setNombre}
            validarNombre={validaciones.validarNombre}
            setValidarNombre={validaciones.setValidarNombre}
            placeholder={"Daniela"}
          />

          <InputNombre
            indice="nombre"
            nombre={"Segundo nombre"}
            value={datosVocero.nombreDos}
            setValue={acciones.setNombreDos}
            validarNombre={validaciones.validarNombreDos}
            setValidarNombre={validaciones.setValidarNombreDos}
            placeholder={"Estefania"}
          />
        </AgruparCamposForm>

        <AgruparCamposForm>
          <InputNombre
            indice="nombre"
            nombre={"Apellido"}
            value={datosVocero.apellido}
            setValue={acciones.setApellido}
            validarNombre={validaciones.validarApellido}
            setValidarNombre={validaciones.setValidarApellido}
            placeholder={"Morgado"}
          />

          <InputNombre
            indice="nombre"
            nombre={"Segundo apellido"}
            value={datosVocero.apellidoDos}
            setValue={acciones.setApellidoDos}
            validarNombre={validaciones.validarApellidoDos}
            setValidarNombre={validaciones.setValidarApellidoDos}
            placeholder={"Peraza"}
          />
        </AgruparCamposForm>

        <AgruparCamposForm>
          <SelectOpcion
            idOpcion={datosVocero.genero}
            nombre={"Genero"}
            handleChange={(e) => {
              cambiarSeleccionGenero(e, acciones.setGenero);
            }}
            opciones={[
              { id: "1", nombre: "Masculino" },
              { id: "2", nombre: "Femenino" },
            ]}
            seleccione={"Seleccione"}
          />

          <InputTelefono
            value={datosVocero.telefono}
            setValue={acciones.setTelefono}
            validarTelefono={validaciones.validarTelefono}
            setValidarTelefono={validaciones.setValidarTelefono}
          />
        </AgruparCamposForm>

        <AgruparCamposForm>
          <InputCorreo
            value={datosVocero.correo}
            setValue={acciones.setCorreo}
            validarCorreo={validaciones.validarCorreo}
            setValidarCorreo={validaciones.setValidarCorreo}
          />

          <InputNombre
            indice="nombre"
            nombre={"Actividad laboral"}
            value={datosVocero.laboral}
            setValue={acciones.setLaboral}
            validarNombre={validaciones.validarLaboral}
            setValidarNombre={validaciones.setValidarLaboral}
            placeholder={"Ejemplo: contraloria social"}
          />
        </AgruparCamposForm>

        <AgruparCamposForm>
          <SelectOpcion
            idOpcion={datosVocero.idCargo}
            nombre={"Cargos"}
            handleChange={(e) => {
              cambiarSeleccionCargo(e, acciones.setIdCargo);
            }}
            opciones={cargos}
            seleccione={"Seleccione"}
            setNombre={acciones.setNombreCargo}
          />

          <SelectOpcion
            idOpcion={datosVocero.idFormacion}
            nombre={"Formaciones"}
            handleChange={(e) => {
              cambiarSeleccionFormacion(e, acciones.setIdFormacion);
            }}
            opciones={formaciones}
            seleccione={"Seleccione"}
            setNombre={acciones.setNombreFormacion}
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
              nombre: datosVocero.nombre,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({ setNombre: acciones.setNombre });
            }}
            campos={{
              nombre: datosVocero.nombre,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
