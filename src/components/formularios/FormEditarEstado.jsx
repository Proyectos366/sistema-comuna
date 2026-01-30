"use client";

import { useEffect } from "react";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "@/components/AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombre from "@/components/inputs/InputNombre";
import InputCodigoPostal from "@/components/inputs/InputCodigoPostal";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";

export default function FormEditarEstado({
  idPais,
  setIdPais,
  nombre,
  setNombre,
  capital,
  setCapital,
  codigoPostal,
  setCodigoPostal,
  descripcion,
  setDescripcion,
  validarNombre,
  setValidarNombre,
  validarCapital,
  setValidarCapital,
  validarCodigoPostal,
  setValidarCodigoPostal,
  setNombrePais,
  paises,
}) {
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
    validarYActualizar(codigoPostal, setValidarCodigoPostal);
  }, [nombre, capital]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <DivScroll>
        <SelectOpcion
          idOpcion={idPais}
          nombre={"Paises"}
          handleChange={(e) => cambiarSeleccionPais(e, setIdPais)}
          opciones={paises}
          seleccione={"Seleccione"}
          setNombre={setNombrePais}
        />

        <InputNombre
          value={nombre}
          setValue={setNombre}
          validarNombre={validarNombre}
          setValidarNombre={setValidarNombre}
        />

        <InputNombre
          htmlFor={"capital"}
          nombre={"Capital"}
          value={capital}
          setValue={setCapital}
          validarNombre={validarCapital}
          setValidarNombre={setValidarCapital}
        />

        <InputCodigoPostal
          value={codigoPostal}
          setValue={setCodigoPostal}
          validarCodigoPostal={validarCodigoPostal}
          setValidarCodigoPostal={setValidarCodigoPostal}
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
              capital,
              codigoPostal,
              descripcion,
              idPais,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              dispatch(resetForm("estadoForm"));
            }}
            campos={{
              nombre,
              capital,
              codigoPostal,
              descripcion,
              idPais,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
