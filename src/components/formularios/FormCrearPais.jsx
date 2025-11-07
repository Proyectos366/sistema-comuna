"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import InputNombre from "@/components/inputs/InputNombre";
import LabelInput from "@/components/inputs/LabelInput";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormCrearPais({
  nombre,
  setNombre,
  capital,
  setCapital,
  descripcion,
  setDescripcion,
  serial,
  setSerial,
  validarNombre,
  setValidarNombre,
  validarCapital,
  setValidarCapital,
  validarSerial,
  setValidarSerial,
}) {
  const dispatch = useDispatch();

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.paisForm
  );

  useEffect(() => {
    if (mostrarCrear) {
      setNombre("");
      setSerial("");
      setDescripcion("");
      setCapital("");
    }
  }, [reiniciarForm, mostrarCrear]);

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
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

      <LabelInput nombre={"Capital"}>
        <InputNombre
          type="text"
          indice="nombre"
          value={capital}
          setValue={setCapital}
          validarNombre={validarCapital}
          setValidarNombre={setValidarCapital}
        />
      </LabelInput>

      <LabelInput nombre={"Descripción"}>
        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
        />
      </LabelInput>

      <LabelInput nombre={"Serial"}>
        <InputNombre
          type="text"
          indice="nombre"
          value={serial}
          setValue={setSerial}
          validarNombre={validarSerial}
          setValidarNombre={setValidarSerial}
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
            capital,
            descripcion,
            serial,
          }}
        />

        <BotonLimpiarCampos
          aceptar={() => {
            dispatch(resetForm("paisForm"));
          }}
          campos={{
            nombre,
            capital,
            descripcion,
            serial,
          }}
        />
      </div>
    </Formulario>
  );
}
