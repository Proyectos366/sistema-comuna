"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import LabelInput from "@/components/inputs/LabelInput";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

export default function FormEditarParroquia({
  idPais,
  setIdPais,
  idEstado,
  setIdEstado,
  idMunicipio,
  setIdMunicipio,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
  setNombrePais,
  setNombreEstado,
  setNombreMunicipio,
}) {
  const dispatch = useDispatch();

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.parroquiaForm
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
  }, [nombre]);

  useEffect(() => {
    if (mostrarCrear) {
      setNombre("");
      setDescripcion("");
      setNombreMunicipio("");
    }
  }, [reiniciarForm, mostrarCrear]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <div className="flex flex-col w-full gap-2 px-1">
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

        <LabelInput nombre={"Descripción"}>
          <InputDescripcion
            value={descripcion}
            setValue={setDescripcion}
            rows={6}
            max={500}
            autoComplete="off"
          />
        </LabelInput>

        <div className="flex space-x-4">
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("crear"));
              dispatch(abrirModal("confirmar"));
            }}
            nombre={"Crear"}
            campos={{
              nombre,
              descripcion,
              idMunicipio,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              dispatch(resetForm("parroquiaForm"));
            }}
            campos={{
              nombre,
              descripcion,
              idMunicipio,
            }}
          />
        </div>
      </div>
    </Formulario>
  );
}
