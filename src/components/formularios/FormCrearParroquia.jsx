"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import InputNombre from "@/components/inputs/InputNombre";
import LabelInput from "@/components/inputs/LabelInput";
import SelectOpcion from "@/components/SelectOpcion";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";

export default function FormCrearParroquia({
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
  paises,
  estados,
  municipios,
}) {
  const dispatch = useDispatch();

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.parroquiaForm
  );

  useEffect(() => {
    if (mostrarCrear) {
      setNombre("");
      setDescripcion("");
      setNombrePais("");
      setNombreEstado("");
      setNombreMunicipio("");
    }
  }, [reiniciarForm, mostrarCrear]);

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <SelectOpcion
        idOpcion={idPais}
        nombre={"Paises"}
        handleChange={(e) => {
          cambiarSeleccionPais(e, setIdPais);
          if (idEstado) {
            setIdEstado("");
          }

          if (idMunicipio) {
            setIdMunicipio("");
          }
        }}
        opciones={paises}
        seleccione={"Seleccione"}
        setNombre={setNombrePais}
        indice={1}
      />

      {idPais && (
        <SelectOpcion
          idOpcion={idEstado}
          nombre={"Estados"}
          handleChange={(e) => {
            cambiarSeleccionEstado(e, setIdEstado);
            if (idMunicipio) {
              setIdMunicipio("");
            }
          }}
          opciones={estados}
          seleccione={"Seleccione"}
          setNombre={setNombreEstado}
          indice={1}
        />
      )}

      {idEstado && (
        <SelectOpcion
          idOpcion={idMunicipio}
          nombre={"Municipios"}
          handleChange={(e) => {
            cambiarSeleccionMunicipio(e, setIdMunicipio);
          }}
          opciones={municipios}
          seleccione={"Seleccione"}
          setNombre={setNombreMunicipio}
          indice={1}
        />
      )}

      {idMunicipio && (
        <>
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
        </>
      )}

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
            descripcion,
            idPais,
            idEstado,
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
            idPais,
            idEstado,
            idMunicipio,
          }}
        />
      </div>
    </Formulario>
  );
}
