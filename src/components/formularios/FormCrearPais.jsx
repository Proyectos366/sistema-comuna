"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "../DivScroll";
import AgruparCamposForm from "../AgruparCamposForm";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
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
    (state) => state.forms.reiniciarForm.paisForm,
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
      <DivScroll>
        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        <InputNombre
          htmlFor={"capital"}
          value={capital}
          setValue={setCapital}
          validarNombre={validarCapital}
          setValidarNombre={setValidarCapital}
        />

        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
        />

        <InputNombre
          htmlFor={"serial"}
          value={serial}
          setValue={setSerial}
          validarNombre={validarSerial}
          setValidarNombre={setValidarSerial}
        />

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
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
