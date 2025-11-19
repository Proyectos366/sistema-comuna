"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import Formulario from "@/components/Formulario";
import Input from "@/components/inputs/Input";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import InputNombre from "@/components/inputs/InputNombre";
import InputRif from "@/components/inputs/InputRif";
import LabelInput from "@/components/inputs/LabelInput";
import SelectOpcion from "@/components/SelectOpcion";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionPais } from "@/utils/dashboard/cambiarSeleccionPais";
import { cambiarSeleccionEstado } from "@/utils/dashboard/cambiarSeleccionEstado";
import { cambiarSeleccionMunicipio } from "@/utils/dashboard/cambiarSeleccionMunicipio";
import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { resetForm } from "@/store/features/formularios/formSlices";
import DivScroll from "../DivScroll";

export default function FormCrearInstitucion({
  acciones,
  datosInstitucion,
  validaciones,
  estados,
  municipios,
  parroquias,
}) {
  const dispatch = useDispatch();
  const { paises } = useSelector((state) => state.paises);

  const mostrarCrear = useSelector((state) => state.modal.modales.crear);
  const reiniciarForm = useSelector(
    (state) => state.forms.reiniciarForm.paisForm
  );

  const {
    setIdPais,
    setIdEstado,
    setIdMunicipio,
    setIdParroquia,
    setNombrePais,
    setNombreEstado,
    setNombreMunicipio,
    setNombreParroquia,
    setNombre,
    setDescripcion,
    setRif,
    setSector,
    setDireccion,
  } = acciones;

  const {
    idPais,
    idEstado,
    idMunicipio,
    idParroquia,
    nombrePais,
    nombreEstado,
    nombreMunicipio,
    nombreParroquia,
    nombre,
    descripcion,
    rif,
    sector,
    direccion,
  } = datosInstitucion;

  const { validarNombre, setValidarNombre, validarRif, setValidarRif } =
    validaciones;

  useEffect(() => {
    if (mostrarCrear) {
      setNombre("");
      setDescripcion("");
      setRif("");
      setSector("");
      setDireccion("");
    }
  }, [reiniciarForm, mostrarCrear]);

  return (
    <Formulario
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <DivScroll>
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
            if (idParroquia) {
              setIdParroquia("");
            }
          }}
          opciones={paises}
          seleccione={"Seleccione"}
          setNombre={setNombrePais}
          indice={0}
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

              if (idParroquia) {
                setIdParroquia("");
              }
            }}
            opciones={estados}
            seleccione={"Seleccione"}
            setNombre={setNombreEstado}
            indice={0}
          />
        )}

        {idEstado && (
          <SelectOpcion
            idOpcion={idMunicipio}
            nombre={"Municipios"}
            handleChange={(e) => {
              cambiarSeleccionMunicipio(e, setIdMunicipio);
              if (idParroquia) {
                setIdParroquia("");
              }
            }}
            opciones={municipios}
            seleccione={"Seleccione"}
            setNombre={setNombreMunicipio}
            indice={0}
          />
        )}

        {idMunicipio && (
          <SelectOpcion
            idOpcion={idParroquia}
            nombre={"Parroquias"}
            handleChange={(e) => {
              cambiarSeleccionParroquia(e, setIdParroquia);
            }}
            opciones={parroquias}
            seleccione={"Seleccione"}
            setNombre={setNombreParroquia}
            indice={0}
          />
        )}

        {idParroquia && (
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

            <LabelInput nombre={"Rif"}>
              <InputRif
                type="text"
                indice="rif"
                value={rif}
                setValue={setRif}
                validarRif={validarRif}
                setValidarRif={setValidarRif}
              />
            </LabelInput>

            <LabelInput nombre={"Sector"}>
              <Input
                type={"text"}
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              />
            </LabelInput>

            <LabelInput nombre={"Dirección"}>
              <Input
                type={"text"}
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
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
                  descripcion,
                  rif,
                  sector,
                  direccion,
                  idPais,
                  idEstado,
                  idMunicipio,
                  idParroquia,
                }}
              />

              <BotonLimpiarCampos
                aceptar={() => {
                  dispatch(resetForm("institucionForm"));
                }}
                campos={{
                  nombre,
                  descripcion,
                  rif,
                  sector,
                  direccion,
                  idPais,
                  idEstado,
                  idMunicipio,
                  idParroquia,
                }}
              />
            </div>
          </>
        )}
      </DivScroll>
    </Formulario>
  );
}
