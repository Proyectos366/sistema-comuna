"use client";

import { useEffect } from "react";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import InputNombre from "@/components/inputs/InputNombre";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

export default function FormEditarMunicipio({
  acciones,
  datosMunicipio,
  validaciones,
}) {
  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setNombrePais,
    setNombreEstado,
    setNombre,
    setDescripcion,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    nombrePais,
    nombreEstado,
    nombre,
    descripcion,
  } = datosMunicipio;

  const { validarNombre, setValidarNombre } = validaciones;

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

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <DivScroll>
        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        <InputDescripcion
          value={descripcion}
          setValue={setDescripcion}
          rows={6}
          max={500}
          autoComplete="off"
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
              descripcion,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              dispatch(resetForm("estadoForm"));
            }}
            campos={{
              nombre,
              descripcion,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
