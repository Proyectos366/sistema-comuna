"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LabelInput from "@/components/inputs/LabelInput";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormEditarPais({
  nombre,
  setNombre,
  capital,
  setCapital,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
  validarCapital,
  setValidarCapital,
}) {
  const dispatch = useDispatch();

  const mostrarEditar = useSelector((state) => state.modal.modales.editar);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.paisForm
  );

  useEffect(() => {
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre);
    validarYActualizar(capital, setValidarCapital);
  }, [nombre, capital]);

  useEffect(() => {
    if (mostrarEditar) {
      setNombre("");
      setDescripcion("");
      setCapital("");
    }
  }, [reiniciarForm, mostrarEditar]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
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
          }}
        />
      </div>
    </Formulario>
  );
}
