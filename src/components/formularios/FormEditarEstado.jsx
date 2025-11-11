"use client";

import { useEffect } from "react";
import LabelInput from "../inputs/LabelInput";
import BotonAceptarCancelar from "../botones/BotonAceptarCancelar";
import Formulario from "../Formulario";
import InputNombre from "../inputs/InputNombre";
import SelectOpcion from "../SelectOpcion";
import InputDescripcion from "../inputs/InputDescripcion";
import InputCodigoPostal from "../inputs/InputCodigoPostal";
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
      <SelectOpcion
        idOpcion={idPais}
        nombre={"Paises"}
        handleChange={(e) => cambiarSeleccionPais(e, setIdPais)}
        opciones={paises}
        seleccione={"Seleccione"}
        setNombre={setNombrePais}
      />

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

      <LabelInput nombre={"Código postal"}>
        <InputCodigoPostal
          value={codigoPostal}
          setValue={setCodigoPostal}
          validarCodigoPostal={validarCodigoPostal}
          setValidarCodigoPostal={setValidarCodigoPostal}
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
      </div>
    </Formulario>
  );
}
