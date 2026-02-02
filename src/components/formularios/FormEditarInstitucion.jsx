"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Formulario from "@/components/Formulario";
import DivScroll from "@/components/DivScroll";
import AgruparCamposForm from "../AgruparCamposForm";
import SelectOpcion from "@/components/SelectOpcion";
import InputNombre from "@/components/inputs/InputNombre";
import InputRif from "@/components/inputs/InputRif";
import InputDescripcion from "@/components/inputs/InputDescripcion";
import InputNombreSinValidar from "../inputs/InputNombreSinValidar";
import BotonAceptarCancelar from "@/components/botones/BotonAceptarCancelar";
import BotonLimpiarCampos from "@/components/botones/BotonLimpiarCampos";

import { cambiarSeleccionParroquia } from "@/utils/dashboard/cambiarSeleccionParroquia";
import { limpiarCampos } from "@/utils/limpiarForm";
import { rifRegex } from "@/utils/regex/rifRegex";
import { textRegex } from "@/utils/regex/textRegex";

import { abrirModal, cerrarModal } from "@/store/features/modal/slicesModal";
import { fetchParroquiasIdMunicipio } from "@/store/features/parroquias/thunks/parroquiasIdMunicipio";
import { fetchInstitucionesIdMunicipio } from "@/store/features/instituciones/thunks/institucionesIdMunicipio";

export default function FormEditarInstitucion({
  acciones,
  datosInstitucion,
  validaciones,
  parroquias,
}) {
  const dispatch = useDispatch();

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
    const validarYActualizar = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = textRegex.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    const validarRif = (valor, setValidar) => {
      if (valor) {
        const limpio = String(valor).trim();
        const esValido = rifRegex.test(limpio);
        if (typeof setValidar === "function") setValidar(esValido);
      }
    };

    validarYActualizar(nombre, setValidarNombre);
    validarRif(rif, setValidarRif);
  }, [nombre, rif]);

  useEffect(() => {
    if (idMunicipio) {
      dispatch(fetchParroquiasIdMunicipio(idMunicipio));
      dispatch(fetchInstitucionesIdMunicipio(idMunicipio));
    }
  }, [dispatch, idMunicipio]);

  return (
    <Formulario onSubmit={(e) => e.preventDefault()} className="">
      <DivScroll>
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

        <InputRif
          value={rif}
          setValue={setRif}
          validarRif={validarRif}
          setValidarRif={setValidarRif}
        />

        <InputNombreSinValidar
          htmlFor={"sector"}
          nombre={"Sector"}
          value={sector}
          setValue={setSector}
        />

        <InputNombreSinValidar
          htmlFor={"direccion"}
          nombre={"Dirección"}
          value={direccion}
          setValue={setDireccion}
        />

        <AgruparCamposForm>
          <BotonAceptarCancelar
            indice={"aceptar"}
            aceptar={() => {
              dispatch(cerrarModal("editar"));
              dispatch(abrirModal("confirmarCambios"));
            }}
            nombre={"Guardar cambios"}
            campos={{
              nombre,
              descripcion,
              rif,
              sector,
              direccion,
              idParroquia,
            }}
          />

          <BotonLimpiarCampos
            aceptar={() => {
              limpiarCampos({
                setNombre,
                setDescripcion,
                setRif,
                setSector,
                setDireccion,
              });
            }}
            campos={{
              nombre,
              descripcion,
              rif,
              sector,
              direccion,
            }}
          />
        </AgruparCamposForm>
      </DivScroll>
    </Formulario>
  );
}
